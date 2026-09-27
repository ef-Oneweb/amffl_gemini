# AMFFL Membership Hub — Complete Technical & Functional Specification

> Reverse-engineering spec for rebuilding the Base44 app in Lovable.dev.
> Items not directly confirmed from code are marked **NOT CONFIRMED**.

---

## 1. Application Overview

- **Name:** AMFFL Membership Hub (`amffl-membership-hub.base44.app`)
- **Purpose:** Nigerian classifieds marketplace + paid tiered membership system (NGN via Paystack). Members buy memberships for listing quotas, visibility, promotions, trust; standalone listing promotions; wallet cashback.
- **Business objectives:** (1) monetize classifieds via tiered memberships; (2) rank listings by promotions + seller tier + verification + reviews + recency; (3) seller trust via verification + reviews; (4) Jiji-style public marketplace landing.
- **Target users:** Guest browsers; authenticated members (sellers/buyers); admins.
- **Core use cases:** browse/search; view listing + contact; register/login; subscribe (Paystack/wallet); create listings (quota); promote listings; reviews; verification (NIN/BVN/document); admin moderation; admin catalog management; bulk CSV import.
- **Modules:** Marketplace (public), Premium Services, Promotions, Member Dashboard, Sell, Verify, Admin, Auth.
- **Architecture:** React SPA (Vite + Tailwind + shadcn/ui + TanStack Query + react-router-dom) on Base44; Base44 entities as DB with per-entity RLS; server logic in Base44 backend functions (Deno, `base44/functions/*/entry.ts`) via `base44.functions.invoke(...)`; Paystack payments; Base44 Core integrations for file upload / CSV extraction.
- **Interaction model:** Pages read entities via React Query (RLS enforces); state changes go through backend functions (service role for privileged writes).
- **Key journeys:**
  - Subscribe: `/premium-services` → pick family → plan + duration → `activateSubscription` → Paystack → `/payment-success` → `paystackVerify`/webhook → Subscription + Transaction + cashback + notification → Dashboard.
  - List: `/sell` (requires active sub) → form + image upload (`UploadPublicFile`) → `createListing` (quota) → detail.
  - Promote: detail (owner) → `PromoteSheet` → `promoteListing` → Paystack/wallet → `applyPromotion`.
  - Verify: `/verify` → `submitVerification` (auto-check) → admin `reviewVerification` → badge.
- **Key rules:** listing creation needs active subscription + per-category quota + featured quota; promotion weights featured=120, urgent=160, top_rank=200, bump_up=60; wallet balance derived (credits − settled/pending debits) with reserve→finalize/void; cashback parsed from `plan.cashback` (% or fixed ₦); durations 1/3/6/12m = 28/90/180/365 days.
- **Assumptions:** Base44 auth + entities + RLS + secrets; Paystack keys; Base44 Core `UploadPublicFile`; AMFFL logo on Base44 media.

---

## 2. Complete Page and Screen Inventory

Routing from `src/App.jsx`. Auth routes public; others under `<MembershipLayout>`. Protected via `<RequireAuth>`; admin via `<AdminRoute>`.

| # | Page | Route | Auth | Purpose |
|---|---|---|---|---|
| 1 | MarketplacePage | `/`, `/marketplace` | Public | Jiji-style landing: hero search, category sidebar (hover flyouts), filter toolbar (state/LGA/condition/sort/price-range), grid, "Recommended", load-more. |
| 2 | ListingDetailPage | `/marketplace/:id` | Public (auth actions) | Gallery, description, price, category/condition/location, seller card (badge + verified), contact reveal (auth), WhatsApp, Promote (owner), ReviewSection. `?promoted=1` banner. |
| 3 | MembershipHome | `/premium-services` | Public | Hero, feature highlights, family cards, auto-opens `MembershipCategoryModal`. |
| 4 | MembershipFamilyPage | `/membership/:family` | Public | Plans grid, duration selector, compare mode (≤3), `MembershipPlanCard`s. |
| 5 | PromotionsPage | `/promotions` | Public | Lists `PromotionPackage`s with tier options + credit engine explainer. |
| 6 | MemberDashboard | `/dashboard` | Auth | ActivePlanCard, BenefitsCard, UsageStatsCard, VerificationCard, DashboardActions, TransactionsList. |
| 7 | CreateListingPage | `/sell` | Auth | Form: family, category, title, description, price, condition, state/LGA, phone, negotiable, images. Quota display. `createListing`. |
| 8 | VerificationPage | `/verify` | Auth | Submit NIN/BVN/document. *(UI detail NOT CONFIRMED; flow confirmed via entity + function.)* |
| 9 | PaymentSuccess | `/payment-success` | Auth | Calls `paystackVerify` to finalize. *(Full read NOT CONFIRMED.)* |
| 10 | Admin | `/admin` | Admin | Tabs: Categories, Plans, Listings, CSV Import, Verifications. |
| 11 | Login | `/login` | Public | Email/password + Google + forgot link. |
| 12 | Register | `/register` | Public | Email/password/confirm + Google; register→OTP→verify→redirect. |
| 13 | ForgotPassword | `/forgot-password` | Public | `resetPasswordRequest`. |
| 14 | ResetPassword | `/reset-password` | Public | Reads `?token=`. |
| 15 | PageNotFound | `*` | Public | 404. |
| 16 | OAuthConsent | (imported) | — | *NOT CONFIRMED in route list.* |

**Modals/sheets/drawers:** `MembershipCategoryModal`, `PromoteSheet`, `ReportModal`, mobile filter drawer, `ListingsImportManager` UI. **Toasts:** `Toaster`.

---

## 3. Navigation and User Flows

- **Header (`TopNav`):** Sticky `bg-primary` (green). Logo + wordmark; desktop links: Marketplace(`/`), Premium Services(`/premium-services`), Promotions(`/promotions`); if authed → Dashboard(`/dashboard`), Post Your Ad(`/sell`), Verify(`/verify`); if admin → Admin(`/admin`). Right: `NotificationBell` (auth), Sign out / Sign In + Sign Up. Mobile hamburger collapses items.
- **Footer:** `MarketplaceFooter` *(content NOT CONFIRMED).*
- **Layout:** `MembershipLayout` = TopNav + `<Outlet/>` + footer.
- **Auth (`AuthContext`):** `base44.app.getPublicSettings()` → if token, `base44.auth.me()`. `logout()` → `base44.auth.logout(redirectUrl)`. `redirectToLogin(nextUrl)`.
- **Post-login redirect:** resolves same-origin `returnTo`, fallback `/`.
- **Flows:** Subscribe→Pay→Dashboard; Sell→create→detail→promote; Browse→detail→contact (auth); Browse→detail→review (auth); Verify→admin approve; Report→admin moderate; Admin seed/migrate.

---

## 4. User Roles and Permissions

- **Guest:** browse, view detail, view premium/promotions, register/login. No contact/review/report/promote/list/verify/dashboard.
- **Member (`role==='user'`):** all guest + contact, review (1/seller, not own), report, list (needs active sub + quota), promote own, verify, dashboard/wallet/transactions, notifications.
- **Admin (`role==='admin'`):** all member + Admin; CRUD families/categories/plans/packages/locations; manage listings; approve/reject verifications; moderate reviews/reports; seeds; CSV import. (Platform default: only admins manage other users.)

**RLS (from schemas):**
- **Listing:** read = active OR owner OR admin; create = admin; update/delete = owner OR admin.
- **Subscription:** read = owner/admin; create = admin; update = owner/admin; delete = admin.
- **Transaction:** read = owner/admin; create = owner/admin; update/delete = admin.
- **WalletLedger:** read = `data.user_id===user.id`/admin; writes = admin (functions use service role).
- **Review:** read = published OR reviewer OR seller OR admin; create = `created_by_id===user.id`; update/delete = admin.
- **ListingReport:** read = reporter/admin; create = reporter; update/delete = admin.
- **SellerVerification:** read = owner/admin; create = any auth; update = owner/admin; delete = admin.
- **AppNotification:** read = owner/admin; create = true (functions); update = owner/admin; delete = admin.
- **MembershipFamily / MarketplaceCategory / MembershipPlan / PromotionPackage / Location:** read open; writes admin.
- **DataValidationIssue / AuditLog:** admin-only read; writes admin (AuditLog create true).
- **User:** built-in; admins manage others; users join via invites (no SDK insert).

---

## 5. Database and Data Model

Base44 entities (JSON docs). Built-ins: `id`, `created_date`, `updated_date`, `created_by_id`.

**User (built-in):** `id`, `created_date`, `full_name`, `email`, `role` (`admin`/`user`).

**MembershipFamily:** `name*`, `slug*`, `description`, `seller_type`, `icon_name`, `icon_color`, `icon_bg`, `route_path*`, `sort_order`(0), `is_active`(true), `accent_color`. RLS: read open, writes admin.

**MembershipPlan:** `name*`, `slug*`, `family_slug*`, `status`(active/inactive/draft, default active), `sort_order`(0), `tier_level`(0), `is_free`(false), `monthly_price`, `price_3m`, `price_6m`, `price_12m`, `currency`("NGN"), `power_up`, `visibility_multiplier`, `featured_ads`(0), `renewal_interval`, `cashback`, `listing_limits`(object: subcategory→number|"Unlimited"), `features`(string[]), `feature_level`(0), `promotion_entitlements`(object), `verification_entitlements`(string[]), `badge`, `header_tint`, `description`, `available_durations`(string[]). RLS: read open, writes admin.

**MarketplaceCategory:** `family_slug*`, `name*`, `slug*`, `subcategories`(string[]), `icon_name`, `accent_color`, `sort_order`(0), `is_active`(true). RLS: read open, writes admin.

**Listing:** `user_id`, `title*`, `description`, `family_slug`, `category` (subcategory name), `category_slug` (top slug), `subcategory`, `price`(number), `currency`("NGN"), `condition`(New/Like New/Good/Fair/Refurbished), `images`(string[]), `location_state`, `location_lga`, `seller_phone`, `negotiable`(false), `plan_id`, `status`(active/inactive/expired/draft, default active), `is_featured`(false), `promotion_type`, `promotion_expiry_date`(date-time), `promotion_score_boost`(0). RLS: read active OR owner OR admin; create admin; update/delete owner OR admin.

**Subscription:** `user_id*`, `plan_id`, `plan_name*`, `family_slug*`, `billing_duration`, `start_date`, `expiry_date`, `status`(pending/active/expired/cancelled/suspended/payment_failed/renewing, default pending), `price`, `currency`("NGN"), `payment_reference`, `auto_renewal_enabled`(false). RLS: read owner/admin; create admin; update owner/admin; delete admin.

**Transaction:** `user_id`, `plan_id`, `plan_name*`, `family_slug`, `duration`, `amount*`, `currency`("NGN"), `paystack_reference*`, `status*`(pending/success/failed/cancelled/refunded, default pending), `invoice_number`, `customer_email`, `paid_at`(date-time), `purpose`(subscription/promotion, default subscription), `listing_id`, `promotion_package`, `promotion_tier`. RLS: read owner/admin; create owner/admin; update/delete admin.

**WalletLedger:** `user_id*`, `type*`(credit/debit), `amount*`, `currency`("NGN"), `reference_type`(subscription/promotion/manual/refund), `reference_id`, `description`, `status`(settled/pending/void, default settled). RLS: read owner/admin; writes admin. Balance **derived**.

**PromotionPackage:** `name*`, `slug*`, `type*`, `description`, `category`, `tier_options`(object[] `{id,duration_days,price,label}`), `is_active`(true), `sort_order`(0), `icon_name`, `accent_color`. RLS: read open, writes admin.

**Review:** `reviewer_id*`, `reviewer_name`, `seller_id*`, `listing_id`, `rating*`(1–5), `comment`, `status`(pending/published/hidden, default pending). RLS: read published OR reviewer OR seller OR admin; create `created_by_id===user.id`; update/delete admin.

**ListingReport:** `reporter_id*`, `reporter_name`, `listing_id*`, `listing_title`, `reason*`(scam/duplicate/wrong_category/inappropriate/other), `details`, `status`(open/dismissed/actioned, default open), `resolved_by_id`, `resolved_at`, `resolution_note`. RLS: read reporter/admin; create reporter; update/delete admin.

**SellerVerification:** `user_id*`, `method*`(nin/bvn/document), `value` (NIN/BVN; empty for document), `document_files`(string[] URLs), `status`(pending/submitted/approved/rejected/expired, default pending), `auto_check`, `submitted_at`, `reviewed_at`, `reviewer_id`, `rejection_reason`, `notes`. RLS: read owner/admin; create any auth; update owner/admin; delete admin.

**AppNotification:** `user_id*`, `event_type*`, `title*`, `message`, `link`, `channel`("in_app"), `is_read`(false). RLS: read owner/admin; create true; update owner/admin; delete admin.

**Location:** `state*`, `lgas`(string[]), `sort_order`(0). RLS: read open, writes admin.

**AuditLog:** `actor_id`, `actor_name`, `action*`, `entity_type*`, `entity_id`, `old_value`, `new_value`, `reason`. RLS: admin-only read; create true; update/delete admin.

**DataValidationIssue:** `issue*`, `affected_plan*`, `category`, `source_value`, `conflicting_value`, `status`(pending_review/approved/rejected/resolved, default pending_review), `notes`, `sort_order`(0). Admin-only.

**Relationships:** User→Subscriptions/Transactions/Listings/WalletLedger/Verifications/Reviews/Notifications (1:N). Subscription→MembershipPlan. Listing→MembershipPlan/MarketplaceCategory/Location. Transaction→Listing (promotions). Review→Listing+seller. ListingReport→Listing+reporter. SellerVerification→User. PromotionPackage→Listing (promotion_type).

---

## 6. CRUD Operations

- **Listing:** Create via `createListing` (auth+sub+quota+featured+audit). Read public active via `browseMarketplace`/`getListing`; owner/admin see non-active. Update/Delete owner/admin (SDK direct, RLS). Admin can deactivate via `moderateReports`.
- **Subscription:** Created by functions only. Read owner/admin. Update owner/admin. Delete admin.
- **Transaction:** Created by functions. Read owner/admin. Update/delete admin.
- **WalletLedger:** Created by functions. Read owner. Status transitions via `finalizeWalletDebit`/`voidWalletDebit`.
- **Review:** Create `submitReview` (pending). Read per RLS. Admin `moderateReviews` → publish/hide/delete.
- **ListingReport:** Create `submitReport`. Admin `moderateReports` → dismiss/action (+ deactivate).
- **SellerVerification:** Create `submitVerification` (submitted). Admin `reviewVerification` → approve/reject.
- **MembershipFamily/Plan/Category/PromotionPackage/Location:** Admin CRUD via SDK (RLS admin).
- **AppNotification:** Functions create; `listNotifications` read; `markNotificationsRead` (ids/all).

---

## 7. Business Logic

- **Listing creation gating:** active subscription matching `family_slug` (or any active fallback); per-category quota from `plan.listing_limits[category]` (Unlimited/-1 allowed); featured quota from `plan.featured_ads` if `is_featured`.
- **Durations/pricing:** 1m/3m/6m/12m → `monthly_price`/`price_3m`/`price_6m`/`price_12m`; expiry 28/90/180/365 days. Free plans: 1m only, amount 0, no Paystack.
- **Payment routing (wallet+card split):** clamp wallet to `min(requested, balance, amount)`; remainder ≤0 → wallet-direct activation (reserve→finalize); else reserve wallet debit + Paystack for remainder; success finalizes debit; failure voids it.
- **Idempotency:** `processSuccessfulPayment` dedupes by `paystack_reference`.
- **Webhook signature:** HMAC-SHA512(raw body, `PAYSTACK_SECRET_KEY`) vs `x-paystack-signature`.
- **Promotion application:** sets `promotion_type`, `promotion_expiry_date` (now + duration_days), `promotion_score_boost` (weight), `is_featured` (featured/urgent/top_rank). Creates Transaction(purpose=promotion) + audit + cashback (card portion) + notification.
- **Ranking (browseMarketplace):** score = promo boost (if not expired: featured120/urgent160/top_rank200/bump_up60) + seller tier×10 + verified(+25) + review trust (≥3 published: (avg−3)×8) + recency (max(0,15−ageDays×2)). Default sort = ranking; explicit sorts override, tie-break by rank/recency. Category counts + price bounds (95th pct max) computed when `include_counts`.
- **Cashback:** `computeCashbackAmount` parses `plan.cashback` ("5%" → % of card amount; "₦1000"/"1000" → fixed). Posts settled credit + notification.
- **Reviews:** one per (reviewer,seller); no own-listing review; pending→admin publish/hide/delete; only published feed ranking/seller card.
- **Verification:** auto-check (NIN/BVN 11 digits; document needs files); block duplicate approved or pending-submitted; admin approve/reject; approved → verified badge + ranking +25.
- **Reports:** reasons enum; no self-report; notify all admins.
- **Notifications:** subscription activated, promotion live, cashback, new review, verification submitted/approved/rejected, listing reported.
- **Quotas:** `listing_limits` keyed by subcategory name; Unlimited/-1 unlimited; counted against active listings.
- **Seeds:** `seedMembership` requires `seed_key==="AMFFL_SEED_2026"`; `seedPromotions` admin-only; idempotent.

---

## 8. Backend Logic (Functions)

Trigger (HTTP `base44.functions.invoke`) → auth → logic → DB → external → result.

- **activateSubscription:** auth → plan → price → free? direct sub : wallet/card split → Paystack or wallet-direct `createActiveSubscription`.
- **paystackCheckout:** auth → plan → price → Paystack initialize (renewals/direct). Returns authorization_url.
- **paystackVerify:** auth → `processSuccessfulPayment` (subscription/promotion).
- **paystackWebhook:** HMAC verify → on `charge.success` → `processSuccessfulPayment`. Idempotent.
- **processSuccessfulPayment (shared):** dedupe by reference → verify → route by `meta.purpose` → `applyPromotion` or `createActiveSubscription`. Finalizes wallet debit; cashback; notifications; audit.
- **promoteListing:** auth → owner check → active sub → package+tier → wallet/card split → Paystack or wallet-direct `applyPromotion`.
- **createListing:** auth → active sub → plan → quota + featured → create Listing (service role) → audit → remaining quota.
- **getListing:** visibility gate → seller badge (sub+plan) + verified + published reviews + `can_review` (auth, not owner, not already reviewed) + `is_owner`.
- **browseMarketplace:** filters (category_slug, category, state, lga, condition, q, min/max price, sort, offset, limit, include_counts) → fetch active → optional counts/price-bounds (paginated 500/batch) → tier/verified/review aggregates → ranking/sort → public projection.
- **submitReview / submitReport / submitVerification / reviewVerification / moderateReviews / moderateReports:** as §6/§7.
- **listNotifications:** auth → notifications + unread_count.
- **markNotificationsRead:** auth → updateMany all-unread or bulkUpdate ids.
- **seedMarketplace / seedMembership / seedPromotions:** idempotent catalog seeding (admin/key-gated).
- **importListings (current):** admin → `UploadPublicFile` → `ExtractDataFromUploadedFile` → normalize → bulkCreate. *(Approved pending change: direct CSV parse.)*

---

## 9. API and Third-Party Integrations

- **Paystack:** `transaction/initialize`, `transaction/verify/:reference`, webhook signature. Auth: `Bearer PAYSTACK_SECRET_KEY`. Secrets: `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`. NGN, kobo amounts. Callbacks: `/payment-success` (subs), `/marketplace/:id?promoted=1` (promos). Metadata: plan_id, duration, family_slug, user_id, use_wallet_amount, wallet_debit_id; promos: purpose, listing_id, package_slug, promotion_type, tier_id, duration_days. Essential.
- **Base44 Core:** `UploadPublicFile` (public storage; listing images, CSV, verification docs), `ExtractDataFromUploadedFile` (CSV→JSON; being replaced), `SendEmail` (platform auth/invites; custom use NOT CONFIRMED), `InvokeLLM`/`GenerateImage`/`TranscribeAudio` available (not core).
- **Base44 Auth:** email/password, Google OAuth, OTP register, password reset — platform-managed.
- **No connectors authorized.**

---

## 10. Authentication and Security

- **Register:** `register({email,password})` → unverified → OTP → `verifyOtp` → setToken → redirect `returnTo`/`/`. Never `loginViaEmailPassword` after register.
- **Login:** `loginViaEmailPassword` → setToken → hard redirect (`window.location.href`) resolving `returnTo`.
- **Provider:** `loginWithProvider('google', fromUrl)`.
- **Logout:** `base44.auth.logout(redirectUrl)` → reload.
- **Reset:** `resetPasswordRequest(email)` (generic success), `resetPassword({resetToken,newPassword})` → `/login`.
- **Session:** token-based; `AuthContext` exposes `user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, authChecked`. `UserNotRegisteredError` blocks unregistered.
- **Protected routes:** `<RequireAuth>` (→ `/login?returnTo=...`), `<AdminRoute>`, `<ProtectedRoute>`.
- **Server enforcement:** functions call `base44.auth.me()` + role check; `base44.asServiceRole` for privileged writes; RLS backs reads.
- **Validation:** required fields, rating 1–5, reason enums, NIN/BVN formats, webhook HMAC.
- **Secrets:** `secrets.get('PAYSTACK_SECRET_KEY')` in Deno; never client-exposed.
- **Rate limiting / sanitization:** NOT CONFIRMED beyond RLS + server validation.

---

## 11. Frontend Component Architecture

Key reusable components (`src/components`):
- **membership/** TopNav, MembershipLayout, MembershipCategoryModal, MembershipPlanCard, DurationSelector, CategoryDropdown, NotificationBell.
- **dashboard/** ActivePlanCard, BenefitsCard, UsageStatsCard, TransactionsList, DashboardActions, VerificationCard, WalletCard, NotificationsCard.
- **marketplace/** MarketplaceHero, CategorySidebar, FilterToolbar, PriceRangeFilter, ListingCard, ListingImages, PromoteSheet, ReviewSection, ReportModal, RatingStars.
- **admin/** CategoriesManager, PlansManager, ListingsManager, ListingsImportManager, ReviewsManager, ReportsManager, VerificationsManager.
- **ui/** full shadcn set (button, input, label, dialog, sheet, slider, etc.).

State: TanStack Query (hooks `useMarketplaceData`, `useMembershipData`, `useEngagementData`) + local `useState`. AuthContext for auth.

---

## 12. UI/UX Specification

- **Design tokens (`src/index.css`/`tailwind.config.js`):** HSL CSS vars → Tailwind. Light theme. Primary green `hsl(142 63% 28%)`; accent light green `hsl(142 55% 92%)`; bg `hsl(210 20% 97%)`; fg `hsl(200 18% 14%)`; card white; border `hsl(210 14% 88%)`; destructive `hsl(0 72% 52%)`; radius `0.5rem`. Fonts: system-ui stack. Charts + sidebar tokens defined.
- **Typography:** extrabold/bold headings, text-sm body, text-xs micro-labels, uppercase `text-[11px]`.
- **Components:** rounded-2xl cards `border-slate-200 bg-white`; rounded-full pill buttons; `bg-primary text-white` primary; outline borders. Inputs `rounded-lg border-slate-200 px-3 py-2 text-sm`.
- **Icons:** lucide-react.
- **Responsive:** `max-w-7xl`; grids `grid-cols-2 sm:grid-cols-3 xl:grid-cols-4`; sidebar hidden <lg (mobile drawer); TopNav hamburger <md.
- **States:** Loader2 spinners; `animate-pulse` skeletons; empty icon+copy; red inline errors; emerald success banners; disabled:opacity-50.
- **Branding:** AMFFL logo (Base44 media PNG) in header + auth; favicon per `index.html`.

---

## 13. Forms and Validation

- **Register:** email, password, confirm (required). OTP step. Google. Inline errors; disabled while in-flight.
- **Login:** email, password, forgot link, Google.
- **ForgotPassword:** email.
- **ResetPassword:** new password + confirm (`?token=`).
- **CreateListing:** family (required), category (required), title (required), description, price (required), condition, state, LGA (dependent), phone, negotiable, images (multi). Client validates title+category+family+price + quota before submit.
- **Verification:** method, value (11 digits nin/bvn), document_files (document). Server auto-check.
- **Review:** rating 1–5 (required), comment; disabled until rating; one/seller.
- **Report:** reason (enum), details.
- **PromoteSheet:** package, tier (price/duration), optional wallet amount → Paystack.
- **MembershipCategoryModal / DurationSelector:** family + duration selectors.

---

## 14. Search, Filtering, Sorting, Pagination

- **Hero search:** `q` + state + category → reset filters, newest, scroll to listings.
- **Sidebar:** category (slug) + subcategory (name) hover flyouts; counts per category.
- **FilterToolbar:** state→LGA (dependent), condition, sort (newest/featured/price_asc/price_desc), price range slider (Radix; bounds from backend 95th pct).
- **Ranking:** §7. Default = ranking (featured); explicit overrides tie-break by rank.
- **Pagination:** offset/limit (page 18) + "Load more" when `has_more`. Backend caps 1–60. Counts paginate 500/batch.
- **Empty:** "No listings found".

---

## 15. Payments, Memberships, Subscriptions

- **Plans:** 5 families × up to 9 tiers (Free→Enterprise Deluxe), NGN. e.g. Vehicles Free 0 → Enterprise Deluxe ₦450,000/mo; Property Free → ₦300,000; All-in-One Diamond Gold ₦110,000 → Enterprise Deluxe ₦500,000. Durations 1/3/6/12m (multi-month = monthly×N seeded). Free = 1m only.
- **Billing:** one-time per duration; `auto_renewal_enabled=false`. `renewal_interval` descriptive.
- **Flow:** `activateSubscription` → Paystack initialize → authorize → `/payment-success` → `paystackVerify`/webhook → `processSuccessfulPayment` → `createActiveSubscription` → Transaction(success) + Subscription(active, expiry) + audit + cashback + notification.
- **Wallet:** derived balance; partial wallet+card for subs + promos; reserve→finalize/void.
- **Promotions:** packages (Featured, Urgent, Top Search Rank, Bump-Up) with tier options (3/7/14/30 days, NGN). `promoteListing` → `applyPromotion` updates Listing + Transaction(promotion) + cashback + notification.
- **Failed/refunds:** failed → void wallet debit; webhook only `charge.success`; no refund UI (admin Transaction update).
- **Plan restrictions:** `listing_limits`, `featured_ads`, `visibility_multiplier`, `cashback`, `badge`, `verification_entitlements`, `promotion_entitlements`, features — enforced in `createListing`/ranking/UI.

---

## 16. Files, Images, Media

- **Upload:** `UploadPublicFile` (public URLs). Listing images + verification docs. Multi-image per listing; comma-split on CSV import.
- **Create listing UI:** `accept="image/*" multiple`; thumbnails + remove; preview grid. No client resize (NOT CONFIRMED).
- **CSV import:** upload via `UploadPublicFile`, URL → `importListings`.
- **Gallery:** `ListingImages` primary + thumbnails.
- **Limits:** NOT CONFIRMED beyond `accept`; platform limits on integrations.

---

## 17. Notifications and Communications

- **In-app:** `AppNotification`; `NotificationBell` (poll 60s, stale 15s); `markNotificationsRead`. Created server-side for: subscription_activated, promotion_active, wallet_credit (cashback), new_review, verification_submitted/approved/rejected, listing_reported (admins).
- **Email:** `SendEmail` available; platform auth/invites. Custom transactional NOT CONFIRMED.
- **SMS/Push:** `SendPushNotification` for native mobile only (not used). No SMS.

---

## 18. Admin Panel

`/admin` (AdminRoute). Tabs (current `Admin.jsx`): Categories, Plans, Listings, CSV Import, Verifications.
- **CategoriesManager / PlansManager:** CRUD families/categories/plans (RLS admin). Plans: pricing per duration, listing_limits, features, badges, tints.
- **ListingsManager:** list/edit/delete listings.
- **ListingsImportManager:** upload CSV → `importListings` → result/error.
- **VerificationsManager:** list submitted → approve/reject (`reviewVerification`).
- **ReviewsManager / ReportsManager:** components + hooks exist (`useAdminReviews`, `useAdminReports`, `useModerateReview`, `useModerateReport`) but **not wired as tabs** in inspected `Admin.jsx` — NOT CONFIRMED reachable elsewhere.
- **Seeds:** `seedMarketplace`, `seedMembership` (key-gated), `seedPromotions` (admin) — invoked manually (UI button NOT CONFIRMED).

---

## 19. Analytics and Reporting

- **Tracking:** `base44.analytics.track` available. Custom events NOT CONFIRMED.
- **Dashboard stats:** UsageStatsCard computes listing counts by category client-side. No revenue/search conversion analytics beyond TransactionsList/admin listing views. PostHog/Sentry connectors available, NOT CONFIRMED connected.

---

## 20. Status and Workflow States

- **Listing:** draft → active (create) → inactive (admin/report) → expired (no auto job; promo expiry separate).
- **Subscription:** pending → active (payment) → expired (checked at runtime via `expiry_date`; no scheduled job confirmed). payment_failed/cancelled/suspended/renewing defined, no auto transitions.
- **Transaction:** pending → success/failed/cancelled/refunded. Created as success on success.
- **WalletLedger:** pending (reserved) → settled / void.
- **Review:** pending → published/hidden; delete.
- **ListingReport:** open → dismissed/actioned (+ deactivate).
- **SellerVerification:** pending → submitted → approved/rejected/expired.

---

## 21. Error Handling and Edge Cases

- **Missing fields:** 400 + message; inline `err`/toast.
- **No active sub (create/promote):** 403; upgrade CTA.
- **Quota reached:** 403 category-specific; quota bar.
- **Payment failure:** non-success → failed; wallet debit voided; stays on authorize.
- **Webhook invalid signature:** 401.
- **Duplicate webhook:** idempotent (reference dedupe).
- **Unauth detail actions:** "Sign in to contact seller" → `/login?returnTo=...`.
- **Listing not found/inactive:** 404; "Listing not found" + back.
- **Review/report own / duplicate review:** 400 blocked.
- **Session expiry:** `authError` types; `UserNotRegisteredError` screen.
- **CSV import:** currently surfaces "Column mapping is temporarily unavailable"; pending direct-parser fix.

---

## 22. Environment Variables and Configuration

- `PAYSTACK_SECRET_KEY` — required — Paystack API + webhook HMAC. Example `sk_live_...`/`sk_test_...`.
- `PAYSTACK_PUBLIC_KEY` — required — client-side Paystack (explicit use NOT CONFIRMED). Example `pk_live_...`.
- No other custom secrets. App public settings via `base44.app.getPublicSettings()`.

---

## 23. Base44-Specific Features

- **Entities + RLS:** entire permission model. Lovable: Postgres/Supabase RLS per §4.
- **Backend functions (Deno):** `createClientFromRequest`, `base44.auth.me()`, `base44.asServiceRole`, `Response.json`. Lovable: Supabase Edge Functions; service-role key.
- **`secrets` (`base44:runtime`):** Lovable: env vars/secret manager.
- **Core integrations:** `UploadPublicFile` → public storage; `ExtractDataFromUploadedFile` → AI CSV. Lovable: Supabase Storage + CSV parser.
- **Auth SDK:** register/OTP/verify, login, providers, reset, `me()`, invites. Lovable: Supabase Auth.
- **`base44.functions.invoke` / `base44.entities.*`:** Lovable: Supabase JS client / generated API.
- **React Query, queryClient, AuthProvider, Toaster, ScrollToTop:** standard; reproducible.
- **Migration challenges:** RLS rule shapes (`$or`+`user_condition`), service-role writes, webhook URL `/functions/paystackWebhook`, file storage URLs, platform-managed User (invites only, no inserts).

---

## 24. Data Migration Requirements

Export Base44 entity JSON → Postgres:
- **Users:** id, email, full_name, role, created_date. (Recreate via auth; can't bulk-insert auth users — map old id by email; add `legacy_id`.)
- **MembershipFamily, MarketplaceCategory, MembershipPlan, PromotionPackage, Location:** table copies; JSON (`listing_limits`, `tier_options`, `features`) → JSONB.
- **Listings:** map `category_slug`→categories, `user_id`→seller, `images`→JSONB/text[]. Align `category`/`category_slug` with new taxonomy.
- **Subscriptions, Transactions, WalletLedger:** map user_id/plan_id/timestamps; keep `paystack_reference`.
- **Reviews, ListingReports, SellerVerifications, AppNotifications, AuditLogs:** copies with user refs.
- **Relationships:** preserve FKs.
- **Issues:** Base44 `id` vs Postgres UUID (keep `legacy_id`); recreate auth users by email; re-host media URLs.

---

## 25. Complete Feature Checklist

| Feature | Frontend | Backend | Entity | Role | Notes |
|---|---|---|---|---|---|
| Marketplace browse/search/filter/sort/paginate | MarketplacePage, CategorySidebar, FilterToolbar, PriceRangeFilter | browseMarketplace | Listing, MarketplaceCategory, Location | public | ranking |
| Listing detail + seller + reviews + contact | ListingDetailPage, ListingImages, ReviewSection, ReportModal | getListing, submitReview, submitReport | Listing, Review, Subscription, SellerVerification | public/auth | contact auth-gated |
| Create listing (quota) | CreateListingPage | createListing | Listing, Subscription, MembershipPlan | auth+sub | per-category + featured quotas |
| Promote listing | PromoteSheet, ListingDetailPage | promoteListing, applyPromotion | Listing, PromotionPackage, Transaction, WalletLedger | auth+sub+owner | wallet/card split |
| Membership catalog + families + plans + durations + compare | MembershipHome, MembershipFamilyPage, MembershipPlanCard, DurationSelector, MembershipCategoryModal | seedMembership | MembershipFamily, MembershipPlan | public | key-gated seed |
| Promotions catalog | PromotionsPage | seedPromotions | PromotionPackage | public | admin seed |
| Subscribe (Paystack/wallet) | MembershipPlanCard, PaymentSuccess | activateSubscription, paystackCheckout, paystackVerify, paystackWebhook, createActiveSubscription | Subscription, Transaction, WalletLedger, AuditLog | auth | cashback, notifications |
| Member dashboard | MemberDashboard + dashboard cards | (hooks read) | Subscription, MembershipPlan, Transaction, WalletLedger, Listing, SellerVerification, AppNotification | auth | |
| Verification | VerificationPage | submitVerification, reviewVerification | SellerVerification, AuditLog | auth/admin | auto-check |
| Notifications | NotificationBell | listNotifications, markNotificationsRead, createNotification | AppNotification | auth | polls 60s |
| Wallet (derived) | WalletCard | getWalletBalance, reserve/finalize/void, postWalletCredit | WalletLedger | auth | reserve→finalize/void |
| Reviews moderation | ReviewsManager | moderateReviews | Review | admin | publish/hide/delete |
| Reports moderation | ReportsManager | moderateReports | ListingReport, Listing | admin | dismiss/action + deactivate |
| Admin categories/plans/listings | CategoriesManager, PlansManager, ListingsManager | (SDK CRUD) | MembershipFamily, MarketplaceCategory, MembershipPlan, Listing | admin | RLS admin |
| CSV import | ListingsImportManager | importListings | Listing, Location, AuditLog | admin | pending direct-parser fix |
| Auth (register/login/reset/Google/OTP) | Login, Register, ForgotPassword, ResetPassword | platform + paystackVerify | User | public | |
| Route guards | AdminRoute, ProtectedRoute, RequireAuth | — | User | admin/auth | |
| Responsive nav/footer | TopNav, MembershipLayout, MarketplaceFooter | — | — | all | |

---

## 26. Lovable.dev Redevelopment Specification

- **Frontend:** React (Vite) + Tailwind + shadcn/ui + TanStack Query + react-router-dom. Replicate §2/§11. AuthContext-equivalent over Supabase Auth.
- **Backend:** Supabase Postgres + Edge Functions (Deno) mirroring each `base44/functions` file. Service-role key for privileged writes. Webhook `/functions/paystackWebhook`.
- **Database:** Tables per §5; JSONB for `listing_limits`, `tier_options`, `features`, `images`, `document_files`, `lgas`. Replicate every RLS policy (§4) as Supabase RLS (`auth.uid()`, `role` column). Add `legacy_id`.
- **Auth:** Supabase Auth — email/password, Google, email OTP register, reset. Roles via `profiles.role`. No bulk user inserts.
- **API:** Edge Functions: activateSubscription, paystackCheckout, paystackVerify, paystackWebhook, promoteListing, createListing, getListing, browseMarketplace, submitReview, submitReport, submitVerification, reviewVerification, moderateReviews, moderateReports, listNotifications, markNotificationsRead, importListings (direct CSV parse), seed*.
- **Components/routing:** replicate §2; query keys/hooks per §11.
- **Integrations:** Paystack (same endpoints/secret), Supabase Storage (replace `UploadPublicFile`), CSV parser (replace `ExtractDataFromUploadedFile`).
- **Env vars:** `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, app public settings.
- **Migration:** export Base44 JSON → ETL → Postgres (§24). Re-host media. Re-map user ids by email.
- **Deployment/testing:** publish via Lovable; configure Paystack webhook to new domain `/functions/paystackWebhook`; run gated seeds; verify RLS with user/admin sessions; test subscribe→pay→dashboard, create→promote, verify→approve, review/report moderation.

---

## 27. Final Completeness Check

Sections 1–26 grounded in inspected code. **NOT CONFIRMED (not fully read this pass):**
- Exact UI of VerificationPage, PaymentSuccess, MarketplaceFooter, MembershipLayout content, ReviewSection, PromoteSheet, MarketplaceHero, admin managers, auth pages — inferred from hooks/schemas/functions.
- ReviewsManager/ReportsManager UI reachability (components/hooks exist; Admin tabs don't include them).
- Client-side image compression/limits beyond `accept="image/*"`.
- Custom email templates beyond platform auth.
- Scheduled jobs for subscription/promotion expiry (enforced at read-time).
- Analytics event tracking calls (SDK available; usage unconfirmed).
- `index.html` SEO/social/favicon exact content.

All other details confirmed from source: App.jsx, AuthContext, TopNav, marketplace/membership/dashboard/admin/listing pages, all backend functions + shared modules, all entity schemas, design tokens, hooks, seed data. This document is sufficient to rebuild the app in Lovable.dev with matching functionality, data model, roles, business logic, and UX.
