import { 
  MembershipPlan, 
  PlanDuration, 
  Subscription, 
  WalletLedger, 
  Transaction, 
  AppNotification,
  PromotionPackage,
  PromotionTierOption,
  Listing
} from '../types';
import { StorageService } from './storageService';

export const DURATION_DAYS_MAP: Record<PlanDuration, number> = {
  '1m': 28,
  '3m': 90,
  '6m': 180,
  '12m': 365,
};

export const DURATION_LABELS: Record<PlanDuration, string> = {
  '1m': '1 Month (28 Days)',
  '3m': '3 Months (90 Days)',
  '6m': '6 Months (180 Days)',
  '12m': '12 Months (1 Year)',
};

export const PROMOTION_WEIGHTS = {
  top_rank: 200,
  urgent: 160,
  featured: 120,
  bump_up: 60,
};

export function getPlanPriceForDuration(plan: MembershipPlan, duration: PlanDuration): number {
  if (plan.is_free) return 0;
  switch (duration) {
    case '1m': return plan.monthly_price;
    case '3m': return plan.price_3m;
    case '6m': return plan.price_6m;
    case '12m': return plan.price_12m;
    default: return plan.monthly_price;
  }
}

export function computeCashbackAmount(cashbackConfig: string, cardPaidAmount: number): number {
  if (!cashbackConfig || cashbackConfig === '0%' || cardPaidAmount <= 0) return 0;
  const trimmed = cashbackConfig.trim();
  if (trimmed.endsWith('%')) {
    const percentage = parseFloat(trimmed.replace('%', ''));
    if (!isNaN(percentage)) {
      return Math.round((percentage / 100) * cardPaidAmount);
    }
  }
  const cleanNumber = trimmed.replace(/[₦, ]/g, '');
  const fixed = parseFloat(cleanNumber);
  if (!isNaN(fixed)) {
    return Math.min(fixed, cardPaidAmount);
  }
  return 0;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  activePlan?: MembershipPlan;
  categoryLimit?: number | 'Unlimited';
  usedCount?: number;
  featuredAllowed?: boolean;
}

export const MembershipService = {
  checkListingQuota(userId: string, category: string, familySlug: string, isFeatured: boolean): QuotaCheckResult {
    const activeSub = StorageService.getUserActiveSubscription(userId, familySlug);
    if (!activeSub) {
      return {
        allowed: false,
        reason: 'An active membership plan is required to post listings. Please subscribe to a plan to start selling.'
      };
    }

    const plans = StorageService.getPlans();
    const plan = plans.find(p => p.id === activeSub.plan_id);
    if (!plan) {
      return { allowed: false, reason: 'Active plan definition could not be resolved.' };
    }

    // Check user active listings in this category/subcategory
    const userListings = StorageService.getListings().filter(l => l.user_id === userId && l.status === 'active');
    
    // Category quota
    let limit: number | 'Unlimited' = 'Unlimited';
    if (plan.listing_limits) {
      if (plan.listing_limits[category] !== undefined) {
        limit = plan.listing_limits[category];
      } else {
        // Fallback to family-level limit or first limit key
        const keys = Object.keys(plan.listing_limits);
        if (keys.length > 0 && typeof plan.listing_limits[keys[0]] === 'number') {
          limit = plan.listing_limits[keys[0]];
        }
      }
    }

    let categoryListingsCount = 0;
    if (limit !== 'Unlimited') {
      categoryListingsCount = userListings.filter(l => 
        l.category === category || l.subcategory === category || l.category_slug === category
      ).length;

      if (categoryListingsCount >= (limit as number)) {
        return {
          allowed: false,
          activePlan: plan,
          categoryLimit: limit,
          usedCount: categoryListingsCount,
          reason: `Listing limit of ${limit} reached for ${category} on your ${plan.name} plan. Upgrade your plan to post more listings.`
        };
      }
    }

    // Featured ads quota check
    let featuredAllowed = true;
    if (isFeatured) {
      const activeFeaturedCount = userListings.filter(l => l.is_featured).length;
      if (activeFeaturedCount >= plan.featured_ads) {
        featuredAllowed = false;
        return {
          allowed: false,
          activePlan: plan,
          reason: `You have used all ${plan.featured_ads} featured ad slots available on your ${plan.name} plan.`
        };
      }
    }

    return {
      allowed: true,
      activePlan: plan,
      categoryLimit: limit,
      usedCount: categoryListingsCount,
      featuredAllowed
    };
  },

  activateSubscription(
    userId: string,
    planId: string,
    duration: PlanDuration,
    walletAmountUsed: number,
    paystackRef: string
  ): { subscription: Subscription; transaction: Transaction; cashbackCredit?: WalletLedger } {
    const user = StorageService.getUserById(userId);
    const plan = StorageService.getPlans().find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    const totalPrice = getPlanPriceForDuration(plan, duration);
    const userBalance = StorageService.getUserWalletBalance(userId);
    const clampedWallet = Math.min(Math.max(0, walletAmountUsed), userBalance, totalPrice);
    const cardPortion = Math.max(0, totalPrice - clampedWallet);

    const now = new Date();
    const durationDays = DURATION_DAYS_MAP[duration];
    const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 1. Create active subscription
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSub: Subscription = {
      id: subId,
      user_id: userId,
      plan_id: plan.id,
      plan_name: plan.name,
      family_slug: plan.family_slug,
      billing_duration: duration,
      start_date: now.toISOString(),
      expiry_date: expiryDate.toISOString(),
      status: 'active',
      price: totalPrice,
      currency: 'NGN',
      payment_reference: paystackRef,
      auto_renewal_enabled: false,
    };
    StorageService.saveSubscription(newSub);

    // 2. Record Wallet Debit if used
    if (clampedWallet > 0) {
      const debit: WalletLedger = {
        id: `w_deb_${Date.now()}`,
        user_id: userId,
        type: 'debit',
        amount: clampedWallet,
        currency: 'NGN',
        reference_type: 'subscription',
        reference_id: subId,
        description: `Wallet contribution for ${plan.name} (${DURATION_LABELS[duration]})`,
        status: 'settled',
        created_date: now.toISOString(),
      };
      StorageService.addWalletEntry(debit);
    }

    // 3. Record Transaction
    const txId = `tx_${Date.now()}`;
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    const tx: Transaction = {
      id: txId,
      user_id: userId,
      plan_id: plan.id,
      plan_name: plan.name,
      family_slug: plan.family_slug,
      duration: duration,
      amount: totalPrice,
      currency: 'NGN',
      paystack_reference: paystackRef,
      status: 'success',
      invoice_number: invoiceNum,
      customer_email: user?.email || 'member@amffl.ng',
      paid_at: now.toISOString(),
      purpose: 'subscription',
    };
    StorageService.saveTransaction(tx);

    // 4. Compute and award Cashback if card portion was paid
    let cashbackCredit: WalletLedger | undefined;
    const cashbackEarned = computeCashbackAmount(plan.cashback, cardPortion);
    if (cashbackEarned > 0) {
      cashbackCredit = {
        id: `w_cash_${Date.now()}`,
        user_id: userId,
        type: 'credit',
        amount: cashbackEarned,
        currency: 'NGN',
        reference_type: 'cashback',
        reference_id: subId,
        description: `${plan.cashback} Cashback for ${plan.name} purchase`,
        status: 'settled',
        created_date: now.toISOString(),
      };
      StorageService.addWalletEntry(cashbackCredit);
    }

    // 5. Update user tier badge if plan has badge
    if (user && plan.badge) {
      user.tier_badge = plan.badge;
      StorageService.saveUser(user);
    }

    // 6. Notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: userId,
      event_type: 'subscription_activated',
      title: `${plan.name} Membership Activated!`,
      message: `Your membership has been activated for ${DURATION_LABELS[duration]}. You can now post and manage your ads.`,
      link: '/dashboard',
      channel: 'in_app',
      is_read: false,
      created_date: now.toISOString(),
    };
    StorageService.saveNotification(notif);

    if (cashbackEarned > 0) {
      const cbNotif: AppNotification = {
        id: `notif_cb_${Date.now()}`,
        user_id: userId,
        event_type: 'wallet_credit',
        title: `₦${cashbackEarned.toLocaleString()} Cashback Credited!`,
        message: `Your ${plan.cashback} cashback reward has been deposited into your AMFFL Wallet.`,
        link: '/dashboard',
        channel: 'in_app',
        is_read: false,
        created_date: now.toISOString(),
      };
      StorageService.saveNotification(cbNotif);
    }

    return { subscription: newSub, transaction: tx, cashbackCredit };
  },

  applyPromotion(
    listingId: string,
    pkg: PromotionPackage,
    tier: PromotionTierOption,
    userId: string,
    walletAmountUsed: number,
    paystackRef: string
  ): { listing: Listing; transaction: Transaction } {
    const listing = StorageService.getListings().find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    const user = StorageService.getUserById(userId);
    const totalPrice = tier.price;
    const userBalance = StorageService.getUserWalletBalance(userId);
    const clampedWallet = Math.min(Math.max(0, walletAmountUsed), userBalance, totalPrice);

    const now = new Date();
    const expiryDate = new Date(now.getTime() + tier.duration_days * 24 * 60 * 60 * 1000);

    // Update listing
    listing.promotion_type = pkg.type;
    listing.promotion_expiry_date = expiryDate.toISOString();
    listing.promotion_score_boost = PROMOTION_WEIGHTS[pkg.type] || 60;
    if (pkg.type === 'featured' || pkg.type === 'urgent' || pkg.type === 'top_rank') {
      listing.is_featured = true;
    }
    StorageService.saveListing(listing);

    // Record wallet deduction if applied
    if (clampedWallet > 0) {
      const debit: WalletLedger = {
        id: `w_deb_p_${Date.now()}`,
        user_id: userId,
        type: 'debit',
        amount: clampedWallet,
        currency: 'NGN',
        reference_type: 'promotion',
        reference_id: listingId,
        description: `Wallet contribution for ${pkg.name} (${tier.label}) on "${listing.title}"`,
        status: 'settled',
        created_date: now.toISOString(),
      };
      StorageService.addWalletEntry(debit);
    }

    // Transaction
    const tx: Transaction = {
      id: `tx_p_${Date.now()}`,
      user_id: userId,
      listing_id: listing.id,
      promotion_package: pkg.name,
      promotion_tier: tier.label,
      amount: totalPrice,
      currency: 'NGN',
      paystack_reference: paystackRef,
      status: 'success',
      invoice_number: `PROMO-${Date.now().toString().slice(-6)}`,
      customer_email: user?.email || 'seller@amffl.ng',
      paid_at: now.toISOString(),
      purpose: 'promotion',
    };
    StorageService.saveTransaction(tx);

    // Notification
    const notif: AppNotification = {
      id: `notif_p_${Date.now()}`,
      user_id: userId,
      event_type: 'promotion_active',
      title: `${pkg.name} is Now Live!`,
      message: `Your listing "${listing.title}" is now boosted with ${pkg.name} for ${tier.label}.`,
      link: `/marketplace/${listing.id}`,
      channel: 'in_app',
      is_read: false,
      created_date: now.toISOString(),
    };
    StorageService.saveNotification(notif);

    return { listing, transaction: tx };
  }
};
