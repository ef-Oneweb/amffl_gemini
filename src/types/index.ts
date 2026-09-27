export type UserRole = 'admin' | 'user';
export type UserAccountStatus = 'active' | 'suspended' | 'deactivated' | 'pending_verification';
export type UserType = 'seller' | 'buyer' | 'admin';

export interface User {
  id: string;
  created_date: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_verified?: boolean;
  tier_badge?: string;
  badges?: string[];
  avatar_url?: string;
  whatsapp?: string;
  company_name?: string;
  member_since?: string;
  // Extended admin lifecycle fields
  status?: UserAccountStatus;
  user_type?: UserType;
  cac_number?: string;
  nin_number?: string;
  bvn_number?: string;
  verification_types?: string[]; // ['phone', 'email', 'nin', 'bvn', 'cac', 'gov_id']
  suspension_reason?: string;
  notes?: string;
  state?: string;
  lga?: string;
  total_spend_ngn?: number;
}

export interface MembershipFamily {
  id: string;
  name: string;
  slug: string;
  description: string;
  seller_type: string;
  icon_name: string;
  icon_color: string;
  icon_bg: string;
  route_path: string;
  sort_order: number;
  is_active: boolean;
  accent_color: string;
}

export type PlanDuration = '1m' | '3m' | '6m' | '12m';

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  family_slug: string;
  status: 'active' | 'inactive' | 'draft';
  sort_order: number;
  tier_level: number;
  is_free: boolean;
  monthly_price: number;
  price_3m: number;
  price_6m: number;
  price_12m: number;
  currency: 'NGN';
  power_up?: string;
  visibility_multiplier: string;
  featured_ads: number;
  renewal_interval: string;
  cashback: string; // e.g. "5%" or "₦1,000"
  listing_limits: Record<string, number | "Unlimited">;
  features: string[];
  feature_level: number;
  promotion_entitlements?: Record<string, any>;
  verification_entitlements?: string[];
  badge?: string;
  header_tint?: string;
  description: string;
  available_durations: PlanDuration[];
}

export interface MarketplaceCategory {
  id: string;
  family_slug: string;
  name: string;
  slug: string;
  subcategories: string[];
  icon_name: string;
  accent_color: string;
  sort_order: number;
  is_active: boolean;
  count?: number;
}

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Refurbished';
export type ListingStatus = 'active' | 'inactive' | 'expired' | 'draft' | 'pending_approval' | 'rejected' | 'suspended' | 'archived';
export type ExtendedListingStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'suspended' | 'expired' | 'archived' | 'deleted';
export type PromotionType = 'featured' | 'urgent' | 'top_rank' | 'bump_up';

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  family_slug: string;
  category: string; // subcategory name
  category_slug: string; // top slug
  subcategory?: string;
  price: number;
  currency: 'NGN';
  condition: ListingCondition;
  images: string[];
  location_state: string;
  location_lga: string;
  seller_phone: string;
  seller_name?: string;
  seller_verified?: boolean;
  seller_tier?: string;
  negotiable: boolean;
  plan_id?: string;
  status: ListingStatus;
  is_featured: boolean;
  promotion_type?: PromotionType;
  promotion_expiry_date?: string;
  promotion_score_boost?: number;
  created_date: string;
  views_count?: number;
  contact_reveals?: number;
  // Computed rank for browse
  computed_rank?: number;
  // Extended lifecycle & admin attributes
  extended_status?: ExtendedListingStatus;
  admin_notes?: string;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  expires_at?: string;
  is_urgent?: boolean;
  attributes?: Record<string, any>;
}

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled' | 'suspended' | 'payment_failed' | 'renewing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  family_slug: string;
  billing_duration: PlanDuration;
  start_date: string;
  expiry_date: string;
  status: SubscriptionStatus;
  price: number;
  currency: 'NGN';
  payment_reference: string;
  auto_renewal_enabled: boolean;
}

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
export type TransactionPurpose = 'subscription' | 'promotion';

export interface Transaction {
  id: string;
  user_id: string;
  plan_id?: string;
  plan_name?: string;
  family_slug?: string;
  duration?: string;
  amount: number;
  currency: 'NGN';
  paystack_reference: string;
  status: TransactionStatus;
  invoice_number: string;
  customer_email: string;
  paid_at: string;
  purpose: TransactionPurpose;
  listing_id?: string;
  promotion_package?: string;
  promotion_tier?: string;
}

export type WalletEntryType = 'credit' | 'debit';
export type WalletReferenceType = 'subscription' | 'promotion' | 'manual' | 'refund' | 'cashback';
export type WalletStatus = 'settled' | 'pending' | 'void';

export interface WalletLedger {
  id: string;
  user_id: string;
  type: WalletEntryType;
  amount: number;
  currency: 'NGN';
  reference_type: WalletReferenceType;
  reference_id: string;
  description: string;
  status: WalletStatus;
  created_date: string;
}

export interface PromotionTierOption {
  id: string;
  duration_days: number;
  price: number;
  label: string;
}

export interface PromotionPackage {
  id: string;
  name: string;
  slug: string;
  type: PromotionType;
  description: string;
  category: 'visibility' | 'ranking';
  tier_options: PromotionTierOption[];
  is_active: boolean;
  sort_order: number;
  icon_name: string;
  accent_color: string;
}

export type ReviewStatus = 'pending' | 'published' | 'hidden';

export interface Review {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  seller_id: string;
  listing_id?: string;
  listing_title?: string;
  rating: number; // 1-5
  comment: string;
  status: ReviewStatus;
  created_date: string;
}

export type ReportReason = 'scam' | 'duplicate' | 'wrong_category' | 'inappropriate' | 'other';
export type ReportStatus = 'open' | 'dismissed' | 'actioned';

export interface ListingReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  listing_id: string;
  listing_title: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  resolved_by_id?: string;
  resolved_at?: string;
  resolution_note?: string;
  created_date: string;
}

export type VerificationMethod = 'nin' | 'bvn' | 'document' | 'cac' | 'passport';
export type VerificationStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired';

export interface SellerVerification {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  method: VerificationMethod;
  value?: string;
  document_files?: string[];
  status: VerificationStatus;
  auto_check: boolean;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  rejection_reason?: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  message: string;
  link: string;
  channel: "in_app";
  is_read: boolean;
  created_date: string;
}

export interface NigerianLocation {
  state: string;
  lgas: string[];
  sort_order: number;
}

export interface FilterState {
  category_slug?: string;
  category?: string;
  state?: string;
  lga?: string;
  condition?: string;
  q?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'recommended' | 'newest' | 'price_asc' | 'price_desc';
}

// ==========================================
// ENTERPRISE ADMIN CONTROL CENTER TYPES
// ==========================================

export type AdminRole = 
  | 'super_admin'
  | 'marketplace_admin'
  | 'marketplace_manager'
  | 'listing_moderator'
  | 'membership_admin'
  | 'user_manager'
  | 'finance_admin'
  | 'promotion_admin'
  | 'verification_admin'
  | 'verification_officer'
  | 'support_admin'
  | 'support_lead'
  | 'content_admin'
  | 'content_editor'
  | 'communications_admin'
  | 'analytics_admin'
  | 'auditor'
  | 'read_only_admin';

export interface AdminUser {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  role: AdminRole;
  status?: 'active' | 'suspended' | 'inactive';
  is_active?: boolean;
  last_login?: string;
  last_active_at?: string;
  created_at: string;
  two_factor_enabled?: boolean;
}

export interface CategoryAttribute {
  id: string;
  category_slug: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'dropdown' | 'multi_select' | 'checkbox' | 'boolean' | 'date';
  options?: string[];
  required: boolean;
  is_filterable: boolean;
  is_searchable: boolean;
  sort_order: number;
}

export interface LocationEntry {
  id: string;
  country: string;
  state: string;
  lgas: string[];
  areas?: Record<string, string[]>;
  status: 'active' | 'inactive';
  sort_order: number;
}

export interface PromotionCreditLedger {
  id: string;
  user_id: string;
  credit_type: string;
  quantity: number;
  delta: number; // positive = granted, negative = used
  balance_after: number;
  reason: string;
  granted_by: string;
  created_date: string;
  status: 'settled' | 'expired' | 'reversed';
}

export type RefundStatus = 'requested' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';

export interface RefundRequest {
  id: string;
  transaction_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  currency: 'NGN';
  reason: string;
  provider: 'paystack' | 'bank_transfer' | 'wallet';
  status: RefundStatus;
  requested_by: string;
  approved_by?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface BankTransferRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  currency: 'NGN';
  purpose: 'subscription' | 'promotion';
  plan_or_package: string;
  bank_name: string;
  account_number?: string;
  sender_name: string;
  transaction_reference: string;
  proof_image_url?: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  admin_notes?: string;
  verified_by?: string;
  created_at: string;
  verified_at?: string;
}

export interface MarketplaceBanner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  mobile_image_url?: string;
  cta_text?: string;
  cta_url?: string;
  link_url?: string;
  placement?: string;
  category_slug?: string;
  display_priority?: number;
  status?: 'draft' | 'scheduled' | 'live' | 'expired' | 'archived';
  is_active?: boolean;
  impressions_count?: number;
  clicks_count?: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface MarketplaceAnnouncement {
  id: string;
  title: string;
  message: string;
  audience?: 'all' | 'sellers' | 'buyers' | 'premium' | 'vip';
  target_audience?: string;
  channel?: 'in_app' | 'email' | 'sms' | 'banner';
  priority?: 'normal' | 'high' | 'urgent';
  severity?: 'normal' | 'info' | 'warning' | 'urgent' | 'success';
  status?: 'draft' | 'published' | 'archived';
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  category: 'legal' | 'help' | 'general';
  content: string;
  status: 'published' | 'draft';
  updated_at: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  event?: string;
  trigger?: string;
  channel: 'in_app' | 'email' | 'sms';
  subject: string;
  body: string;
  variables?: string[];
  is_active: boolean;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'admin';
  sender_name: string;
  message: string;
  timestamp: string;
  is_internal?: boolean;
  sender_role?: string;
  created_at?: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  category: 'billing' | 'verification' | 'listing' | 'technical' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'waiting_for_user' | 'waiting_user' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
  assigned_to?: string;
  messages: SupportTicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface RankingWeightsConfig {
  subscription?: number;
  seller_rating?: number;
  recent_activity?: number;
  ad_quality?: number;
  response_rate?: number;
  promotion?: number;
  subscription_plan_weight: number;
  seller_rating_weight: number;
  seller_response_time_weight: number;
  verified_seller_boost: number;
  image_count_and_quality: number;
  listing_age_decay: number;
  renewal_recency_boost: number;
}

export interface MarketplaceSettings {
  marketplace_name: string;
  currency: 'NGN';
  timezone: string;
  default_listing_duration_days: number;
  auto_approve_listings: boolean;
  max_images_per_listing: number;
  max_image_size_mb: number;
  allowed_file_types: string[];
  auto_renewal_intervals: string[];
  require_verification_for_high_value: boolean;
  high_value_threshold_ngn: number;
  require_login_for_contact?: boolean;
  watermark_images?: boolean;
  auto_expire_days?: number;
  escrow_fee_percent?: number;
  max_photos_per_listing?: number;
  min_listing_price_ngn?: number;
}

export interface FeatureFlag {
  id?: string;
  key: string;
  name: string;
  description: string;
  is_enabled: boolean;
  enabled?: boolean;
  category: 'membership' | 'payments' | 'listings' | 'security';
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_role: string;
  action: string;
  entity: string;
  entity_id: string;
  actor_id?: string;
  actor_name?: string;
  target_type?: string;
  target_id?: string;
  details?: any;
  before_state?: any;
  after_state?: any;
  reason?: string;
  ip_address?: string;
  timestamp: string;
}

export interface ValidationIssue {
  id: string;
  entity: string;
  entity_type?: string;
  problem: string;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  current_value?: string;
  conflicting_value?: string;
  status: 'open' | 'resolved' | 'ignored';
  resolution?: string;
  resolved_by?: string;
  date?: string;
}
