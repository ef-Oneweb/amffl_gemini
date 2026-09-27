import { 
  Listing, 
  MembershipFamily, 
  MembershipPlan, 
  MarketplaceCategory, 
  PromotionPackage, 
  Subscription, 
  WalletLedger, 
  Transaction, 
  SellerVerification, 
  Review, 
  ListingReport, 
  AppNotification, 
  User,
  AdminUser,
  AdminRole,
  MarketplaceBanner,
  MarketplaceAnnouncement,
  CMSPage,
  NotificationTemplate,
  SupportTicket,
  ValidationIssue,
  RankingWeightsConfig,
  MarketplaceSettings,
  FeatureFlag,
  CategoryAttribute,
  BankTransferRecord,
  RefundRequest,
  PromotionCreditLedger,
  AuditLog,
  ExtendedListingStatus,
  UserAccountStatus
} from '../types';
import { 
  INITIAL_FAMILIES, 
  INITIAL_PLANS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROMOTIONS, 
  INITIAL_LISTINGS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_WALLET, 
  INITIAL_REVIEWS, 
  DEMO_USERS 
} from '../data/seedData';
import {
  DEFAULT_ADMIN_USERS,
  DEFAULT_BANNERS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_CMS_PAGES,
  DEFAULT_NOTIFICATION_TEMPLATES,
  DEFAULT_SUPPORT_TICKETS,
  DEFAULT_VALIDATION_ISSUES,
  DEFAULT_RANKING_WEIGHTS,
  DEFAULT_MARKETPLACE_SETTINGS,
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_CATEGORY_ATTRIBUTES,
  DEFAULT_BANK_TRANSFERS,
  DEFAULT_REFUND_REQUESTS,
  DEFAULT_CREDIT_LEDGER,
  INITIAL_AUDIT_LOGS
} from '../data/adminSeedData';

const KEYS = {
  LISTINGS: 'amffl_listings',
  FAMILIES: 'amffl_families',
  PLANS: 'amffl_plans',
  CATEGORIES: 'amffl_categories',
  PROMOTIONS: 'amffl_promotions',
  SUBSCRIPTIONS: 'amffl_subscriptions',
  WALLET: 'amffl_wallet',
  TRANSACTIONS: 'amffl_transactions',
  VERIFICATIONS: 'amffl_verifications',
  REVIEWS: 'amffl_reviews',
  REPORTS: 'amffl_reports',
  NOTIFICATIONS: 'amffl_notifications',
  USERS: 'amffl_users',
  CURRENT_USER_ID: 'amffl_current_user_id',
  // Enterprise Admin Keys
  ADMIN_USERS: 'amffl_admin_users',
  ACTIVE_ADMIN_ROLE: 'amffl_active_admin_role',
  BANNERS: 'amffl_banners',
  ANNOUNCEMENTS: 'amffl_announcements',
  CMS_PAGES: 'amffl_cms_pages',
  TEMPLATES: 'amffl_templates',
  TICKETS: 'amffl_tickets',
  VALIDATION_ISSUES: 'amffl_validation_issues',
  RANKING_WEIGHTS: 'amffl_ranking_weights',
  MARKETPLACE_SETTINGS: 'amffl_marketplace_settings',
  FEATURE_FLAGS: 'amffl_feature_flags',
  CATEGORY_ATTRIBUTES: 'amffl_category_attributes',
  BANK_TRANSFERS: 'amffl_bank_transfers',
  REFUNDS: 'amffl_refunds',
  CREDIT_LEDGER: 'amffl_credit_ledger',
  AUDIT_LOGS: 'amffl_audit_logs',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(val) as T;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('amffl_store_update', { detail: { key } }));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage`, err);
  }
}

export const StorageService = {
  // Initialization
  init() {
    if (!localStorage.getItem(KEYS.FAMILIES)) setItem(KEYS.FAMILIES, INITIAL_FAMILIES);
    if (!localStorage.getItem(KEYS.PLANS)) setItem(KEYS.PLANS, INITIAL_PLANS);
    if (!localStorage.getItem(KEYS.CATEGORIES)) setItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!localStorage.getItem(KEYS.PROMOTIONS)) setItem(KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    if (!localStorage.getItem(KEYS.LISTINGS)) setItem(KEYS.LISTINGS, INITIAL_LISTINGS);
    if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) setItem(KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    if (!localStorage.getItem(KEYS.WALLET)) setItem(KEYS.WALLET, INITIAL_WALLET);
    if (!localStorage.getItem(KEYS.REVIEWS)) setItem(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!localStorage.getItem(KEYS.USERS)) setItem(KEYS.USERS, DEMO_USERS);
    if (!localStorage.getItem(KEYS.ADMIN_USERS)) setItem(KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    if (!localStorage.getItem(KEYS.ACTIVE_ADMIN_ROLE)) setItem(KEYS.ACTIVE_ADMIN_ROLE, 'super_admin');
    if (!localStorage.getItem(KEYS.BANNERS)) setItem(KEYS.BANNERS, DEFAULT_BANNERS);
    if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) setItem(KEYS.ANNOUNCEMENTS, DEFAULT_ANNOUNCEMENTS);
    if (!localStorage.getItem(KEYS.CMS_PAGES)) setItem(KEYS.CMS_PAGES, DEFAULT_CMS_PAGES);
    if (!localStorage.getItem(KEYS.TEMPLATES)) setItem(KEYS.TEMPLATES, DEFAULT_NOTIFICATION_TEMPLATES);
    if (!localStorage.getItem(KEYS.TICKETS)) setItem(KEYS.TICKETS, DEFAULT_SUPPORT_TICKETS);
    if (!localStorage.getItem(KEYS.VALIDATION_ISSUES)) setItem(KEYS.VALIDATION_ISSUES, DEFAULT_VALIDATION_ISSUES);
    if (!localStorage.getItem(KEYS.RANKING_WEIGHTS)) setItem(KEYS.RANKING_WEIGHTS, DEFAULT_RANKING_WEIGHTS);
    if (!localStorage.getItem(KEYS.MARKETPLACE_SETTINGS)) setItem(KEYS.MARKETPLACE_SETTINGS, DEFAULT_MARKETPLACE_SETTINGS);
    if (!localStorage.getItem(KEYS.FEATURE_FLAGS)) setItem(KEYS.FEATURE_FLAGS, DEFAULT_FEATURE_FLAGS);
    if (!localStorage.getItem(KEYS.CATEGORY_ATTRIBUTES)) setItem(KEYS.CATEGORY_ATTRIBUTES, DEFAULT_CATEGORY_ATTRIBUTES);
    if (!localStorage.getItem(KEYS.BANK_TRANSFERS)) setItem(KEYS.BANK_TRANSFERS, DEFAULT_BANK_TRANSFERS);
    if (!localStorage.getItem(KEYS.REFUNDS)) setItem(KEYS.REFUNDS, DEFAULT_REFUND_REQUESTS);
    if (!localStorage.getItem(KEYS.CREDIT_LEDGER)) setItem(KEYS.CREDIT_LEDGER, DEFAULT_CREDIT_LEDGER);
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) setItem(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    if (!localStorage.getItem(KEYS.VERIFICATIONS)) {
      const initVerifications: SellerVerification[] = [
        {
          id: 'ver-1',
          user_id: 'user-emeka',
          user_name: 'Chief Emeka Okafor',
          user_email: 'emeka.auto@amffl.ng',
          method: 'nin',
          value: '29384756102',
          status: 'approved',
          auto_check: true,
          submitted_at: '2026-02-15T10:00:00Z',
          reviewed_at: '2026-02-15T11:30:00Z',
          reviewer_id: 'user-admin',
          notes: 'Verified against NIMC database records',
        },
        {
          id: 'ver-2',
          user_id: 'user-fatima',
          user_name: 'Hajiya Fatima Bello',
          user_email: 'fatima.kano@amffl.ng',
          method: 'bvn',
          value: '22119933445',
          status: 'approved',
          auto_check: true,
          submitted_at: '2026-03-02T09:00:00Z',
          reviewed_at: '2026-03-02T10:00:00Z',
          reviewer_id: 'user-admin',
          notes: 'BVN matched commercial bank account credentials',
        },
      ];
      setItem(KEYS.VERIFICATIONS, initVerifications);
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      const initNotes: AppNotification[] = [
        {
          id: 'notif-1',
          user_id: 'user-emeka',
          event_type: 'subscription_activated',
          title: 'Enterprise Gold Active',
          message: 'Your Enterprise Gold membership is active with 350 ad quota and 80x visibility boost.',
          link: '/dashboard',
          channel: 'in_app',
          is_read: false,
          created_date: '2026-09-01T00:01:00Z',
        },
        {
          id: 'notif-2',
          user_id: 'user-emeka',
          event_type: 'wallet_credit',
          title: '₦17,000 Cashback Credited',
          message: '10% membership cashback reward has been added to your AMFFL Wallet balance.',
          link: '/dashboard',
          channel: 'in_app',
          is_read: true,
          created_date: '2026-09-01T00:02:00Z',
        }
      ];
      setItem(KEYS.NOTIFICATIONS, initNotes);
    }
  },

  resetToDefaults() {
    localStorage.clear();
    this.init();
    window.location.reload();
  },

  // Listings
  getListings(): Listing[] {
    return getItem<Listing[]>(KEYS.LISTINGS, INITIAL_LISTINGS);
  },
  saveListing(listing: Listing): void {
    const list = this.getListings();
    const index = list.findIndex(l => l.id === listing.id);
    if (index >= 0) {
      list[index] = listing;
    } else {
      list.unshift(listing);
    }
    setItem(KEYS.LISTINGS, list);
  },
  deleteListing(id: string): void {
    const list = this.getListings().filter(l => l.id !== id);
    setItem(KEYS.LISTINGS, list);
  },

  // Families & Plans
  getFamilies(): MembershipFamily[] {
    return getItem<MembershipFamily[]>(KEYS.FAMILIES, INITIAL_FAMILIES);
  },
  saveFamily(fam: MembershipFamily): void {
    const items = this.getFamilies();
    const index = items.findIndex(f => f.id === fam.id);
    if (index >= 0) items[index] = fam;
    else items.push(fam);
    setItem(KEYS.FAMILIES, items);
  },
  getPlans(): MembershipPlan[] {
    return getItem<MembershipPlan[]>(KEYS.PLANS, INITIAL_PLANS);
  },
  savePlan(plan: MembershipPlan): void {
    const items = this.getPlans();
    const index = items.findIndex(p => p.id === plan.id);
    if (index >= 0) items[index] = plan;
    else items.push(plan);
    setItem(KEYS.PLANS, items);
  },

  // Categories
  getCategories(): MarketplaceCategory[] {
    return getItem<MarketplaceCategory[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory(cat: MarketplaceCategory): void {
    const items = this.getCategories();
    const index = items.findIndex(c => c.id === cat.id);
    if (index >= 0) items[index] = cat;
    else items.push(cat);
    setItem(KEYS.CATEGORIES, items);
  },

  // Promotions
  getPromotions(): PromotionPackage[] {
    return getItem<PromotionPackage[]>(KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  },

  // Subscriptions
  getSubscriptions(): Subscription[] {
    return getItem<Subscription[]>(KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
  },
  saveSubscription(sub: Subscription): void {
    const items = this.getSubscriptions();
    const index = items.findIndex(s => s.id === sub.id);
    if (index >= 0) items[index] = sub;
    else items.unshift(sub);
    setItem(KEYS.SUBSCRIPTIONS, items);
  },
  getUserActiveSubscription(userId: string, familySlug?: string): Subscription | undefined {
    const subs = this.getSubscriptions().filter(s => s.user_id === userId && s.status === 'active');
    const now = new Date();
    const validSubs = subs.filter(s => new Date(s.expiry_date) > now);
    if (familySlug) {
      const match = validSubs.find(s => s.family_slug === familySlug);
      if (match) return match;
    }
    // All-in-one covers all, or return first active
    const allInOne = validSubs.find(s => s.family_slug === 'all-in-one');
    if (allInOne) return allInOne;
    return validSubs[0];
  },

  // Wallet
  getWalletEntries(): WalletLedger[] {
    return getItem<WalletLedger[]>(KEYS.WALLET, INITIAL_WALLET);
  },
  getUserWalletBalance(userId: string): number {
    const entries = this.getWalletEntries().filter(e => e.user_id === userId);
    let balance = 0;
    for (const e of entries) {
      if (e.type === 'credit' && e.status === 'settled') {
        balance += e.amount;
      } else if (e.type === 'debit' && (e.status === 'settled' || e.status === 'pending')) {
        balance -= e.amount;
      }
    }
    return Math.max(0, balance);
  },
  addWalletEntry(entry: WalletLedger): void {
    const entries = this.getWalletEntries();
    entries.unshift(entry);
    setItem(KEYS.WALLET, entries);
  },

  // Transactions
  getTransactions(): Transaction[] {
    return getItem<Transaction[]>(KEYS.TRANSACTIONS, []);
  },
  saveTransaction(tx: Transaction): void {
    const items = this.getTransactions();
    items.unshift(tx);
    setItem(KEYS.TRANSACTIONS, items);
  },

  // Verifications
  getVerifications(): SellerVerification[] {
    return getItem<SellerVerification[]>(KEYS.VERIFICATIONS, []);
  },
  saveVerification(ver: SellerVerification): void {
    const items = this.getVerifications();
    const index = items.findIndex(v => v.id === ver.id);
    if (index >= 0) items[index] = ver;
    else items.unshift(ver);
    setItem(KEYS.VERIFICATIONS, items);
  },

  // Reviews
  getReviews(): Review[] {
    return getItem<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  saveReview(rev: Review): void {
    const items = this.getReviews();
    items.unshift(rev);
    setItem(KEYS.REVIEWS, items);
  },
  updateReviewStatus(id: string, status: 'published' | 'hidden'): void {
    const items = this.getReviews();
    const target = items.find(r => r.id === id);
    if (target) {
      target.status = status;
      setItem(KEYS.REVIEWS, items);
    }
  },

  // Reports
  getReports(): ListingReport[] {
    return getItem<ListingReport[]>(KEYS.REPORTS, []);
  },
  saveReport(rep: ListingReport): void {
    const items = this.getReports();
    items.unshift(rep);
    setItem(KEYS.REPORTS, items);
  },
  updateReportStatus(id: string, status: 'open' | 'dismissed' | 'actioned', note?: string): void {
    const items = this.getReports();
    const target = items.find(r => r.id === id);
    if (target) {
      target.status = status;
      target.resolution_note = note;
      target.resolved_at = new Date().toISOString();
      setItem(KEYS.REPORTS, items);
    }
  },

  // Notifications
  getNotifications(): AppNotification[] {
    return getItem<AppNotification[]>(KEYS.NOTIFICATIONS, []);
  },
  getUserNotifications(userId: string): AppNotification[] {
    return this.getNotifications().filter(n => n.user_id === userId);
  },
  saveNotification(notif: AppNotification): void {
    const items = this.getNotifications();
    items.unshift(notif);
    setItem(KEYS.NOTIFICATIONS, items);
  },
  markAllNotificationsRead(userId: string): void {
    const items = this.getNotifications();
    items.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    setItem(KEYS.NOTIFICATIONS, items);
  },

  // Users
  getUsers(): User[] {
    return getItem<User[]>(KEYS.USERS, DEMO_USERS);
  },
  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },
  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) users[index] = user;
    else users.push(user);
    setItem(KEYS.USERS, users);
  },
  getCurrentUserId(): string {
    return localStorage.getItem(KEYS.CURRENT_USER_ID) || 'user-emeka';
  },
  setCurrentUserId(id: string): void {
    localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    window.dispatchEvent(new CustomEvent('amffl_store_update', { detail: { key: KEYS.CURRENT_USER_ID } }));
  },

  // ==========================================
  // ENTERPRISE AUDIT LOGGING (IMMUTABLE)
  // ==========================================
  logAuditEvent(entry: {
    action: string;
    entity?: string;
    entity_id?: string;
    target_type?: string;
    target_id?: string;
    actor_id?: string;
    actor_name?: string;
    actor_role?: string;
    details?: any;
    before_state?: any;
    after_state?: any;
    reason?: string;
    admin_id?: string;
    admin_name?: string;
    admin_role?: string;
  }): void {
    const logs = getItem<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const activeRole = this.getActiveAdminRole();
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      admin_id: entry.admin_id || entry.actor_id || 'admin-super',
      admin_name: entry.admin_name || entry.actor_name || 'Administrator',
      admin_role: entry.admin_role || entry.actor_role || activeRole,
      action: entry.action,
      entity: entry.entity || entry.target_type || 'system',
      entity_id: entry.entity_id || entry.target_id || 'system',
      actor_id: entry.actor_id || entry.admin_id,
      actor_name: entry.actor_name || entry.admin_name,
      target_type: entry.target_type || entry.entity,
      target_id: entry.target_id || entry.entity_id,
      details: entry.details,
      before_state: entry.before_state,
      after_state: entry.after_state,
      reason: entry.reason || (entry.details ? JSON.stringify(entry.details) : 'Operational change via Admin Control Center'),
      ip_address: '102.89.43.12 (Lagos, NG)',
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    setItem(KEYS.AUDIT_LOGS, logs);
  },
  getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // ==========================================
  // ADMIN ROLES & RBAC
  // ==========================================
  getActiveAdminRole(): AdminRole {
    return getItem<AdminRole>(KEYS.ACTIVE_ADMIN_ROLE, 'super_admin');
  },
  setActiveAdminRole(role: AdminRole): void {
    setItem(KEYS.ACTIVE_ADMIN_ROLE, role);
    this.logAuditEvent({
      action: 'ADMIN_ROLE_SWITCH',
      entity: 'AdminSession',
      entity_id: 'session-role',
      after_state: { role },
      reason: `Switched active testing role to ${role}`,
    });
  },
  canPerformPermission(role: AdminRole, permission: string): boolean {
    if (role === 'super_admin') return true;
    if (role === 'read_only_admin') {
      return permission.endsWith('.read') || permission.endsWith('.view') || permission.startsWith('reports.') || permission === 'export.run';
    }
    const rolePermissions: Record<AdminRole, string[]> = {
      super_admin: ['*'],
      marketplace_admin: ['listings.*', 'categories.*', 'locations.*', 'attributes.*', 'users.read', 'sellers.*', 'reports.*', 'export.*', 'manage_categories', 'manage_memberships'],
      marketplace_manager: ['listings.*', 'categories.*', 'locations.*', 'attributes.*', 'users.read', 'sellers.*', 'reports.*', 'export.*', 'manage_categories', 'manage_memberships'],
      listing_moderator: ['listings.read', 'listings.approve', 'listings.reject', 'listings.suspend', 'listings.feature', 'reports.*', 'reviews.*', 'moderate_listings'],
      membership_admin: ['plans.*', 'quotas.*', 'subscriptions.*', 'families.*', 'analytics.membership', 'export.*', 'manage_memberships'],
      user_manager: ['users.*', 'sellers.*', 'buyers.*', 'verification.*', 'manage_users'],
      finance_admin: ['payments.*', 'refunds.*', 'bank_transfers.*', 'analytics.revenue', 'subscriptions.read', 'export.*', 'verify_payments', 'manage_refunds'],
      promotion_admin: ['promotions.*', 'credits.*', 'analytics.promotions', 'export.*'],
      verification_admin: ['verification.*', 'sellers.verify', 'users.verify', 'reports.read', 'approve_verifications'],
      verification_officer: ['verification.*', 'sellers.verify', 'users.verify', 'reports.read', 'approve_verifications'],
      support_admin: ['tickets.*', 'users.read', 'listings.read', 'reports.read', 'reviews.read', 'manage_support'],
      support_lead: ['tickets.*', 'users.read', 'listings.read', 'reports.read', 'reviews.read', 'manage_support'],
      content_admin: ['cms.*', 'banners.*', 'announcements.*', 'templates.*', 'manage_cms'],
      content_editor: ['cms.*', 'banners.*', 'announcements.*', 'templates.*', 'manage_cms'],
      communications_admin: ['cms.*', 'banners.*', 'announcements.*', 'templates.*', 'manage_cms'],
      analytics_admin: ['analytics.*', 'reports.*', 'export.*'],
      auditor: ['*.read', 'audit.*', 'export.*', 'view_audit_logs'],
      read_only_admin: ['*.read', 'view_audit_logs']
    };
    const perms = rolePermissions[role] || [];
    if (perms.includes('*') || perms.includes(permission)) return true;
    const [mod] = permission.split('.');
    if (perms.includes(`${mod}.*`)) return true;
    return false;
  },
  getAdminUsers(): AdminUser[] {
    return getItem<AdminUser[]>(KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
  },
  saveAdminUser(admin: AdminUser, actor: string = 'Super Admin'): void {
    const list = this.getAdminUsers();
    const idx = list.findIndex(a => a.id === admin.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = admin;
    else list.push(admin);
    setItem(KEYS.ADMIN_USERS, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'ADMIN_USER_UPDATE' : 'ADMIN_USER_CREATE',
      entity: 'AdminUser',
      entity_id: admin.id,
      before_state: before,
      after_state: admin,
      reason: `Admin user ${admin.name} role set to ${admin.role}`,
      admin_name: actor,
    });
  },

  // ==========================================
  // EXTENDED LISTING LIFECYCLE MANAGEMENT
  // ==========================================
  approveListing(id: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'active';
      target.extended_status = 'active';
      target.reviewed_by = actor;
      target.reviewed_at = new Date().toISOString();
      delete target.rejection_reason;
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_APPROVE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Listing approved for public marketplace display',
        admin_name: actor,
      });
    }
  },
  rejectListing(id: string, reason: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'inactive';
      target.extended_status = 'rejected';
      target.rejection_reason = reason;
      target.reviewed_by = actor;
      target.reviewed_at = new Date().toISOString();
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_REJECT',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Rejection reason: ${reason}`,
        admin_name: actor,
      });
    }
  },
  suspendListing(id: string, reason: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'inactive';
      target.extended_status = 'suspended';
      target.admin_notes = `Suspended: ${reason}`;
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_SUSPEND',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Suspended by admin: ${reason}`,
        admin_name: actor,
      });
    }
  },
  archiveListing(id: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'inactive';
      target.extended_status = 'archived';
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_ARCHIVE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Archived listing to preserve historical record',
        admin_name: actor,
      });
    }
  },
  restoreListing(id: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'active';
      target.extended_status = 'active';
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_RESTORE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Restored listing to active published status',
        admin_name: actor,
      });
    }
  },
  softDeleteListing(id: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'inactive';
      target.extended_status = 'deleted';
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_SOFT_DELETE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Soft deleted from marketplace while preserving relational integrity',
        admin_name: actor,
      });
    }
  },
  toggleFeatureListing(id: string, isFeatured: boolean, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.is_featured = isFeatured;
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: isFeatured ? 'LISTING_FEATURE' : 'LISTING_UNFEATURE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: isFeatured ? 'Featured listing on homepage and department spotlight' : 'Removed featured status',
        admin_name: actor,
      });
    }
  },
  setListingPromotion(id: string, promoType: any, expiryDate: string, actor: string = 'Administrator'): void {
    const list = this.getListings();
    const target = list.find(l => l.id === id);
    if (target) {
      const before = { ...target };
      target.promotion_type = promoType;
      target.promotion_expiry_date = expiryDate;
      target.promotion_score_boost = promoType === 'top_rank' ? 50 : promoType === 'featured' ? 30 : 15;
      setItem(KEYS.LISTINGS, list);
      this.logAuditEvent({
        action: 'LISTING_PROMOTE',
        entity: 'Listing',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Applied ${promoType} promotion boost until ${expiryDate}`,
        admin_name: actor,
      });
    }
  },

  // ==========================================
  // USER & SELLER GOVERNANCE
  // ==========================================
  suspendUser(id: string, reason: string, actor: string = 'Administrator'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'suspended';
      target.suspension_reason = reason;
      setItem(KEYS.USERS, users);
      this.logAuditEvent({
        action: 'USER_SUSPEND',
        entity: 'User',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `User suspended: ${reason}`,
        admin_name: actor,
      });
    }
  },
  restoreUser(id: string, actor: string = 'Administrator'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'active';
      delete target.suspension_reason;
      setItem(KEYS.USERS, users);
      this.logAuditEvent({
        action: 'USER_RESTORE',
        entity: 'User',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'User account restored to active standing',
        admin_name: actor,
      });
    }
  },
  deactivateUser(id: string, actor: string = 'Administrator'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'deactivated';
      setItem(KEYS.USERS, users);
      this.logAuditEvent({
        action: 'USER_DEACTIVATE',
        entity: 'User',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Account deactivated',
        admin_name: actor,
      });
    }
  },
  verifyUserAccount(id: string, method: string = 'nin', actor: string = 'Administrator'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      const before = { ...target };
      target.is_verified = true;
      if (!target.verification_types) target.verification_types = [];
      if (!target.verification_types.includes(method)) target.verification_types.push(method);
      setItem(KEYS.USERS, users);
      this.logAuditEvent({
        action: 'USER_VERIFY',
        entity: 'User',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Verified seller badge granted via ${method.toUpperCase()}`,
        admin_name: actor,
      });
    }
  },
  revokeUserVerification(id: string, reason: string, actor: string = 'Administrator'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      const before = { ...target };
      target.is_verified = false;
      target.verification_types = [];
      setItem(KEYS.USERS, users);
      this.logAuditEvent({
        action: 'USER_VERIFY_REVOKE',
        entity: 'User',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Verification revoked: ${reason}`,
        admin_name: actor,
      });
    }
  },

  // ==========================================
  // MEMBERSHIP & SUBSCRIPTION MANAGEMENT
  // ==========================================
  createManualSubscription(data: {
    userId: string;
    familySlug: string;
    planId: string;
    planName: string;
    duration: any;
    price: number;
    reason: string;
  }, actor: string = 'Administrator'): Subscription {
    const subs = this.getSubscriptions();
    const now = new Date();
    const durationDays = data.duration === '12m' ? 365 : data.duration === '6m' ? 180 : data.duration === '3m' ? 90 : 30;
    const expiry = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const newSub: Subscription = {
      id: `sub-man-${Date.now()}`,
      user_id: data.userId,
      plan_id: data.planId,
      plan_name: data.planName,
      family_slug: data.familySlug,
      billing_duration: data.duration,
      start_date: now.toISOString(),
      expiry_date: expiry,
      status: 'active',
      price: data.price,
      currency: 'NGN',
      payment_reference: `MANUAL_ADMIN_${Date.now()}`,
      auto_renewal_enabled: false,
    };
    subs.unshift(newSub);
    setItem(KEYS.SUBSCRIPTIONS, subs);
    this.logAuditEvent({
      action: 'SUBSCRIPTION_MANUAL_CREATE',
      entity: 'Subscription',
      entity_id: newSub.id,
      after_state: newSub,
      reason: `Manual subscription issued by admin: ${data.reason}`,
      admin_name: actor,
    });
    return newSub;
  },
  updateSubscriptionStatus(id: string, status: any, actor: string = 'Administrator'): void {
    const subs = this.getSubscriptions();
    const target = subs.find(s => s.id === id);
    if (target) {
      const before = { ...target };
      target.status = status;
      setItem(KEYS.SUBSCRIPTIONS, subs);
      this.logAuditEvent({
        action: 'SUBSCRIPTION_STATUS_CHANGE',
        entity: 'Subscription',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Subscription status updated to ${status}`,
        admin_name: actor,
      });
    }
  },

  // ==========================================
  // PROMOTIONS & CREDIT LEDGER
  // ==========================================
  getCreditLedger(): PromotionCreditLedger[] {
    return getItem<PromotionCreditLedger[]>(KEYS.CREDIT_LEDGER, DEFAULT_CREDIT_LEDGER);
  },
  grantPromotionCredits(userId: string, creditType: string, quantity: number, reason: string, actor: string = 'Administrator'): void {
    const ledger = this.getCreditLedger();
    const userLedger = ledger.filter(l => l.user_id === userId && l.status === 'settled');
    const currentBalance = userLedger.reduce((sum, l) => sum + l.delta, 0);
    const newEntry: PromotionCreditLedger = {
      id: `crd-${Date.now()}`,
      user_id: userId,
      credit_type: creditType,
      quantity,
      delta: quantity,
      balance_after: currentBalance + quantity,
      reason,
      granted_by: actor,
      created_date: new Date().toISOString(),
      status: 'settled',
    };
    ledger.unshift(newEntry);
    setItem(KEYS.CREDIT_LEDGER, ledger);
    this.logAuditEvent({
      action: 'PROMOTION_CREDIT_GRANT',
      entity: 'PromotionCreditLedger',
      entity_id: newEntry.id,
      after_state: newEntry,
      reason: `Granted ${quantity} ${creditType} credits to user ${userId}: ${reason}`,
      admin_name: actor,
    });
  },
  deductPromotionCredits(userId: string, creditType: string, quantity: number, reason: string, actor: string = 'Administrator'): void {
    const ledger = this.getCreditLedger();
    const userLedger = ledger.filter(l => l.user_id === userId && l.status === 'settled');
    const currentBalance = userLedger.reduce((sum, l) => sum + l.delta, 0);
    const newEntry: PromotionCreditLedger = {
      id: `crd-${Date.now()}`,
      user_id: userId,
      credit_type: creditType,
      quantity,
      delta: -quantity,
      balance_after: Math.max(0, currentBalance - quantity),
      reason,
      granted_by: actor,
      created_date: new Date().toISOString(),
      status: 'settled',
    };
    ledger.unshift(newEntry);
    setItem(KEYS.CREDIT_LEDGER, ledger);
    this.logAuditEvent({
      action: 'PROMOTION_CREDIT_DEDUCT',
      entity: 'PromotionCreditLedger',
      entity_id: newEntry.id,
      after_state: newEntry,
      reason: `Deducted ${quantity} ${creditType} credits from user ${userId}: ${reason}`,
      admin_name: actor,
    });
  },

  // ==========================================
  // PAYMENTS, REFUNDS & BANK TRANSFERS
  // ==========================================
  getBankTransfers(): BankTransferRecord[] {
    return getItem<BankTransferRecord[]>(KEYS.BANK_TRANSFERS, DEFAULT_BANK_TRANSFERS);
  },
  verifyBankTransfer(id: string, actor: string = 'Finance Admin'): void {
    const list = this.getBankTransfers();
    const target = list.find(b => b.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'verified';
      target.verified_by = actor;
      target.verified_at = new Date().toISOString();
      setItem(KEYS.BANK_TRANSFERS, list);
      this.logAuditEvent({
        action: 'BANK_TRANSFER_VERIFY',
        entity: 'BankTransferRecord',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: 'Bank transfer payment verified against treasury bank statement',
        admin_name: actor,
      });
    }
  },
  rejectBankTransfer(id: string, reason: string, actor: string = 'Finance Admin'): void {
    const list = this.getBankTransfers();
    const target = list.find(b => b.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'rejected';
      target.admin_notes = `Rejected: ${reason}`;
      setItem(KEYS.BANK_TRANSFERS, list);
      this.logAuditEvent({
        action: 'BANK_TRANSFER_REJECT',
        entity: 'BankTransferRecord',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Bank transfer rejected: ${reason}`,
        admin_name: actor,
      });
    }
  },
  getRefundRequests(): RefundRequest[] {
    return getItem<RefundRequest[]>(KEYS.REFUNDS, DEFAULT_REFUND_REQUESTS);
  },
  createRefundRequest(req: Omit<RefundRequest, 'id' | 'created_at' | 'status'>, actor: string = 'Administrator'): RefundRequest {
    const list = this.getRefundRequests();
    const newReq: RefundRequest = {
      ...req,
      id: `ref-${Date.now()}`,
      status: 'requested',
      created_at: new Date().toISOString(),
    };
    list.unshift(newReq);
    setItem(KEYS.REFUNDS, list);
    this.logAuditEvent({
      action: 'REFUND_REQUEST_CREATE',
      entity: 'RefundRequest',
      entity_id: newReq.id,
      after_state: newReq,
      reason: `Refund requested for ₦${newReq.amount.toLocaleString()}: ${newReq.reason}`,
      admin_name: actor,
    });
    return newReq;
  },
  updateRefundStatus(id: string, status: any, notes?: string, actor: string = 'Finance Admin'): void {
    const list = this.getRefundRequests();
    const target = list.find(r => r.id === id);
    if (target) {
      const before = { ...target };
      target.status = status;
      if (status === 'approved') target.approved_by = actor;
      if (notes) target.admin_notes = notes;
      target.updated_at = new Date().toISOString();
      setItem(KEYS.REFUNDS, list);
      this.logAuditEvent({
        action: `REFUND_STATUS_${status.toUpperCase()}`,
        entity: 'RefundRequest',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Refund status updated to ${status}. Notes: ${notes || 'N/A'}`,
        admin_name: actor,
      });
    }
  },

  // ==========================================
  // CATEGORY ATTRIBUTES & LOCATIONS
  // ==========================================
  getCategoryAttributes(categorySlug?: string): CategoryAttribute[] {
    const attrs = getItem<CategoryAttribute[]>(KEYS.CATEGORY_ATTRIBUTES, DEFAULT_CATEGORY_ATTRIBUTES);
    if (categorySlug) return attrs.filter(a => a.category_slug === categorySlug);
    return attrs;
  },
  saveCategoryAttribute(attr: CategoryAttribute, actor: string = 'Administrator'): void {
    const attrs = this.getCategoryAttributes();
    const idx = attrs.findIndex(a => a.id === attr.id);
    const before = idx >= 0 ? { ...attrs[idx] } : undefined;
    if (idx >= 0) attrs[idx] = attr;
    else attrs.push(attr);
    setItem(KEYS.CATEGORY_ATTRIBUTES, attrs);
    this.logAuditEvent({
      action: idx >= 0 ? 'ATTRIBUTE_UPDATE' : 'ATTRIBUTE_CREATE',
      entity: 'CategoryAttribute',
      entity_id: attr.id,
      before_state: before,
      after_state: attr,
      reason: `Attribute ${attr.label} for category ${attr.category_slug}`,
      admin_name: actor,
    });
  },
  deleteCategoryAttribute(id: string, actor: string = 'Administrator'): void {
    const attrs = this.getCategoryAttributes();
    const target = attrs.find(a => a.id === id);
    const filtered = attrs.filter(a => a.id !== id);
    setItem(KEYS.CATEGORY_ATTRIBUTES, filtered);
    this.logAuditEvent({
      action: 'ATTRIBUTE_DELETE',
      entity: 'CategoryAttribute',
      entity_id: id,
      before_state: target,
      reason: 'Deleted custom category attribute',
      admin_name: actor,
    });
  },

  // ==========================================
  // CMS, BANNERS & ANNOUNCEMENTS
  // ==========================================
  getBanners(): MarketplaceBanner[] {
    return getItem<MarketplaceBanner[]>(KEYS.BANNERS, DEFAULT_BANNERS);
  },
  saveBanner(banner: MarketplaceBanner, actor: string = 'Administrator'): void {
    const list = this.getBanners();
    const idx = list.findIndex(b => b.id === banner.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = banner;
    else list.push(banner);
    setItem(KEYS.BANNERS, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'BANNER_UPDATE' : 'BANNER_CREATE',
      entity: 'MarketplaceBanner',
      entity_id: banner.id,
      before_state: before,
      after_state: banner,
      reason: `Banner ${banner.title} set to ${banner.status}`,
      admin_name: actor,
    });
  },
  deleteBanner(id: string, actor: string = 'Administrator'): void {
    const list = this.getBanners();
    const target = list.find(b => b.id === id);
    const filtered = list.filter(b => b.id !== id);
    setItem(KEYS.BANNERS, filtered);
    this.logAuditEvent({
      action: 'BANNER_DELETE',
      entity: 'MarketplaceBanner',
      entity_id: id,
      before_state: target,
      reason: 'Banner removed by admin',
      admin_name: actor,
    });
  },
  getAnnouncements(): MarketplaceAnnouncement[] {
    return getItem<MarketplaceAnnouncement[]>(KEYS.ANNOUNCEMENTS, DEFAULT_ANNOUNCEMENTS);
  },
  saveAnnouncement(ann: MarketplaceAnnouncement, actor: string = 'Administrator'): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === ann.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = ann;
    else list.unshift(ann);
    setItem(KEYS.ANNOUNCEMENTS, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'ANNOUNCEMENT_UPDATE' : 'ANNOUNCEMENT_CREATE',
      entity: 'MarketplaceAnnouncement',
      entity_id: ann.id,
      before_state: before,
      after_state: ann,
      reason: `Announcement targeted at ${ann.audience}`,
      admin_name: actor,
    });
  },
  deleteAnnouncement(id: string, actor: string = 'Administrator'): void {
    const list = this.getAnnouncements();
    const target = list.find(a => a.id === id);
    const filtered = list.filter(a => a.id !== id);
    setItem(KEYS.ANNOUNCEMENTS, filtered);
    this.logAuditEvent({
      action: 'ANNOUNCEMENT_DELETE',
      entity: 'MarketplaceAnnouncement',
      entity_id: id,
      before_state: target,
      reason: 'Announcement deleted',
      admin_name: actor,
    });
  },
  getCmsPages(): CMSPage[] {
    return getItem<CMSPage[]>(KEYS.CMS_PAGES, DEFAULT_CMS_PAGES);
  },
  saveCmsPage(page: CMSPage, actor: string = 'Administrator'): void {
    const list = this.getCmsPages();
    const idx = list.findIndex(p => p.id === page.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = page;
    else list.push(page);
    setItem(KEYS.CMS_PAGES, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'CMS_PAGE_UPDATE' : 'CMS_PAGE_CREATE',
      entity: 'CMSPage',
      entity_id: page.id,
      before_state: before,
      after_state: page,
      reason: `CMS page ${page.slug} updated`,
      admin_name: actor,
    });
  },

  // ==========================================
  // COMMUNICATION TEMPLATES
  // ==========================================
  getNotificationTemplates(): NotificationTemplate[] {
    return getItem<NotificationTemplate[]>(KEYS.TEMPLATES, DEFAULT_NOTIFICATION_TEMPLATES);
  },
  saveNotificationTemplate(template: NotificationTemplate, actor: string = 'Administrator'): void {
    const list = this.getNotificationTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = template;
    else list.push(template);
    setItem(KEYS.TEMPLATES, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'TEMPLATE_UPDATE' : 'TEMPLATE_CREATE',
      entity: 'NotificationTemplate',
      entity_id: template.id,
      before_state: before,
      after_state: template,
      reason: `Template ${template.name} for event ${template.event}`,
      admin_name: actor,
    });
  },

  // ==========================================
  // SUPPORT TICKETS
  // ==========================================
  getSupportTickets(): SupportTicket[] {
    return getItem<SupportTicket[]>(KEYS.TICKETS, DEFAULT_SUPPORT_TICKETS);
  },
  saveSupportTicket(ticket: SupportTicket, actor: string = 'Support Admin'): void {
    const list = this.getSupportTickets();
    const idx = list.findIndex(t => t.id === ticket.id);
    const before = idx >= 0 ? { ...list[idx] } : undefined;
    if (idx >= 0) list[idx] = ticket;
    else list.unshift(ticket);
    setItem(KEYS.TICKETS, list);
    this.logAuditEvent({
      action: idx >= 0 ? 'TICKET_UPDATE' : 'TICKET_CREATE',
      entity: 'SupportTicket',
      entity_id: ticket.id,
      before_state: before,
      after_state: ticket,
      reason: `Ticket ${ticket.ticket_number} updated`,
      admin_name: actor,
    });
  },
  replySupportTicket(
    ticketId: string, 
    message: string, 
    senderName: string = 'Admin', 
    isInternal: boolean = false, 
    actor: string = 'Support Admin'
  ): void {
    const list = this.getSupportTickets();
    const target = list.find(t => t.id === ticketId);
    if (target) {
      target.messages.push({
        id: `msg-${Date.now()}`,
        sender: 'admin',
        sender_name: senderName,
        message,
        timestamp: new Date().toISOString(),
        is_internal: isInternal,
      });
      target.updated_at = new Date().toISOString();
      if (!isInternal && target.status === 'open') {
        target.status = 'waiting_for_user';
      }
      setItem(KEYS.TICKETS, list);
      this.logAuditEvent({
        action: isInternal ? 'TICKET_INTERNAL_NOTE' : 'TICKET_REPLY',
        entity: 'SupportTicket',
        entity_id: ticketId,
        reason: isInternal ? 'Added internal staff note' : 'Replied to customer inquiry',
        admin_name: actor,
      });
    }
  },
  addSupportMessage(
    ticketId: string,
    actorId: string,
    senderName: string,
    message: string,
    isInternal: boolean = false
  ): void {
    this.replySupportTicket(ticketId, message, senderName, isInternal, actorId);
  },
  updateTicketStatus(ticketId: string, status: any, actor: string = 'Support Admin'): void {
    const list = this.getSupportTickets();
    const target = list.find(t => t.id === ticketId);
    if (target) {
      const before = { ...target };
      target.status = status;
      target.updated_at = new Date().toISOString();
      setItem(KEYS.TICKETS, list);
      this.logAuditEvent({
        action: 'TICKET_STATUS_CHANGE',
        entity: 'SupportTicket',
        entity_id: ticketId,
        before_state: before,
        after_state: target,
        reason: `Support ticket status changed to ${status}`,
        admin_name: actor,
      });
    }
  },

  // ==========================================
  // RANKING, SETTINGS & VALIDATION
  // ==========================================
  getRankingWeights(): RankingWeightsConfig {
    return getItem<RankingWeightsConfig>(KEYS.RANKING_WEIGHTS, DEFAULT_RANKING_WEIGHTS);
  },
  saveRankingWeights(weights: RankingWeightsConfig, actor: string = 'Administrator'): void {
    const before = this.getRankingWeights();
    setItem(KEYS.RANKING_WEIGHTS, weights);
    this.logAuditEvent({
      action: 'RANKING_WEIGHTS_UPDATE',
      entity: 'RankingWeightsConfig',
      entity_id: 'global-ranking-weights',
      before_state: before,
      after_state: weights,
      reason: 'Marketplace discovery algorithm weights adjusted',
      admin_name: actor,
    });
  },
  getMarketplaceSettings(): MarketplaceSettings {
    return getItem<MarketplaceSettings>(KEYS.MARKETPLACE_SETTINGS, DEFAULT_MARKETPLACE_SETTINGS);
  },
  saveMarketplaceSettings(settings: MarketplaceSettings, actor: string = 'Administrator'): void {
    const before = this.getMarketplaceSettings();
    setItem(KEYS.MARKETPLACE_SETTINGS, settings);
    this.logAuditEvent({
      action: 'MARKETPLACE_SETTINGS_UPDATE',
      entity: 'MarketplaceSettings',
      entity_id: 'global-marketplace-settings',
      before_state: before,
      after_state: settings,
      reason: 'Global marketplace configuration parameters updated',
      admin_name: actor,
    });
  },
  getFeatureFlags(): FeatureFlag[] {
    return getItem<FeatureFlag[]>(KEYS.FEATURE_FLAGS, DEFAULT_FEATURE_FLAGS);
  },
  toggleFeatureFlag(key: string, isEnabled?: boolean, actor: string = 'Administrator'): void {
    const list = this.getFeatureFlags();
    const target = list.find(f => f.key === key || (f as any).id === key);
    if (target) {
      const before = { ...target };
      target.is_enabled = isEnabled !== undefined ? isEnabled : !target.is_enabled;
      (target as any).enabled = target.is_enabled;
      setItem(KEYS.FEATURE_FLAGS, list);
      this.logAuditEvent({
        action: 'FEATURE_FLAG_TOGGLE',
        entity: 'FeatureFlag',
        entity_id: key,
        before_state: before,
        after_state: target,
        reason: `Feature flag ${key} set to ${target.is_enabled}`,
        admin_name: actor,
      });
    }
  },
  getValidationIssues(): ValidationIssue[] {
    return getItem<ValidationIssue[]>(KEYS.VALIDATION_ISSUES, DEFAULT_VALIDATION_ISSUES);
  },
  resolveValidationIssue(id: string, resolution: string, actor: string = 'Administrator'): void {
    const list = this.getValidationIssues();
    const target = list.find(v => v.id === id);
    if (target) {
      const before = { ...target };
      target.status = 'resolved';
      target.resolution = resolution;
      target.resolved_by = actor;
      setItem(KEYS.VALIDATION_ISSUES, list);
      this.logAuditEvent({
        action: 'VALIDATION_ISSUE_RESOLVE',
        entity: 'ValidationIssue',
        entity_id: id,
        before_state: before,
        after_state: target,
        reason: `Conflict resolved: ${resolution}`,
        admin_name: actor,
      });
    }
  }
};

// Auto-run init
StorageService.init();
