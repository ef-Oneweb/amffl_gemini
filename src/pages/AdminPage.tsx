import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar, AdminSectionKey } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminOverviewDesk } from '../components/admin/AdminOverviewDesk';
import { AdminListingsDesk } from '../components/admin/AdminListingsDesk';
import { AdminListingEditorModal } from '../components/admin/AdminListingEditorModal';
import { AdminCategoriesDesk } from '../components/admin/AdminCategoriesDesk';
import { AdminLocationsDesk } from '../components/admin/AdminLocationsDesk';
import { AdminMembershipsDesk } from '../components/admin/AdminMembershipsDesk';
import { AdminPromotionsDesk } from '../components/admin/AdminPromotionsDesk';
import { AdminUsersDesk } from '../components/admin/AdminUsersDesk';
import { AdminPaymentsDesk } from '../components/admin/AdminPaymentsDesk';
import { AdminVerificationsDesk } from '../components/admin/AdminVerificationsDesk';
import { AdminModerationDesk } from '../components/admin/AdminModerationDesk';
import { AdminCmsDesk } from '../components/admin/AdminCmsDesk';
import { AdminSupportDesk } from '../components/admin/AdminSupportDesk';
import { AdminSettingsDesk } from '../components/admin/AdminSettingsDesk';
import { AdminRbacDesk } from '../components/admin/AdminRbacDesk';
import { AdminAuditLogsDesk } from '../components/admin/AdminAuditLogsDesk';
import { AdminDataValidationDesk } from '../components/admin/AdminDataValidationDesk';
import { AdminExportCenterDesk } from '../components/admin/AdminExportCenterDesk';
import { AdminSystemHealthDesk } from '../components/admin/AdminSystemHealthDesk';
import { StorageService } from '../services/storageService';
import { 
  Listing, 
  User, 
  MarketplaceCategory, 
  CategoryAttribute, 
  MembershipFamily, 
  MembershipPlan, 
  Subscription, 
  Transaction, 
  SellerVerification, 
  ListingReport, 
  SupportTicket, 
  BankTransferRecord, 
  RefundRequest, 
  PromotionPackage, 
  PromotionCreditLedger, 
  AuditLog, 
  AdminUser, 
  AdminRole 
} from '../types';

export const AdminPage: React.FC = () => {
  const { user, role, adminRole, switchAdminRole, canPerform } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSectionKey>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Quick Action Modal states
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Authoritative Core Datasets
  const [listings, setListings] = useState<Listing[]>(() => StorageService.getListings());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [categories, setCategories] = useState<MarketplaceCategory[]>(() => StorageService.getCategories());
  const [attributes, setAttributes] = useState<CategoryAttribute[]>(() => StorageService.getCategoryAttributes());
  const [families, setFamilies] = useState<MembershipFamily[]>(() => StorageService.getFamilies());
  const [plans, setPlans] = useState<MembershipPlan[]>(() => StorageService.getPlans());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => StorageService.getSubscriptions());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [verifications, setVerifications] = useState<SellerVerification[]>(() => StorageService.getVerifications());
  const [reports, setReports] = useState<ListingReport[]>(() => StorageService.getReports());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getSupportTickets());
  const [transfers, setTransfers] = useState<BankTransferRecord[]>(() => StorageService.getBankTransfers());
  const [refunds, setRefunds] = useState<RefundRequest[]>(() => StorageService.getRefundRequests());
  const [promotions, setPromotions] = useState<PromotionPackage[]>(() => StorageService.getPromotions());
  const [creditLedger, setCreditLedger] = useState<PromotionCreditLedger[]>(() => StorageService.getCreditLedger());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => StorageService.getAdminUsers());

  const refreshAll = useCallback(() => {
    setListings(StorageService.getListings());
    setUsers(StorageService.getUsers());
    setCategories(StorageService.getCategories());
    setAttributes(StorageService.getCategoryAttributes());
    setFamilies(StorageService.getFamilies());
    setPlans(StorageService.getPlans());
    setSubscriptions(StorageService.getSubscriptions());
    setTransactions(StorageService.getTransactions());
    setVerifications(StorageService.getVerifications());
    setReports(StorageService.getReports());
    setTickets(StorageService.getSupportTickets());
    setTransfers(StorageService.getBankTransfers());
    setRefunds(StorageService.getRefundRequests());
    setPromotions(StorageService.getPromotions());
    setCreditLedger(StorageService.getCreditLedger());
    setAuditLogs(StorageService.getAuditLogs());
    setAdminUsers(StorageService.getAdminUsers());
  }, []);

  useEffect(() => {
    const handleStoreUpdate = () => refreshAll();
    window.addEventListener('amffl_store_update', handleStoreUpdate);
    return () => window.removeEventListener('amffl_store_update', handleStoreUpdate);
  }, [refreshAll]);

  if (role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          Administrator Access Required
        </h2>
        <p className="text-xs text-slate-500">
          You must have active administrator credentials to enter the AMFFL Governance &amp; Operations Center.
        </p>
        <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-200 inline-block">
          Tip: Use the top Sandbox bar to switch your active persona to &quot;Admin (Tunde Adeleke)&quot;.
        </p>
      </div>
    );
  }

  const badgeCounts = {
    pendingListings: listings.filter(l => l.status === 'pending_approval' || (l as any).status === 'pending').length,
    pendingVerifications: verifications.filter(v => v.status === 'pending').length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    reportedAds: reports.filter(r => r.status === 'open').length,
    pendingTransfers: transfers.filter(b => b.status === 'pending').length,
    validationIssues: StorageService.getValidationIssues().filter(i => i.status !== 'resolved').length
  };

  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case 'new-listing':
        setEditingListing(null);
        setIsNewListingModalOpen(true);
        break;
      case 'new-user':
        setCurrentSection('users-all');
        break;
      case 'new-plan':
        setCurrentSection('membership-plans');
        break;
      case 'grant-credits':
        setCurrentSection('promotions-credits');
        break;
      case 'manual-sub':
        setCurrentSection('membership-subscriptions');
        break;
      case 'new-banner':
        setCurrentSection('content-banners');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-['Inter',sans-serif]">
      {/* Top Admin Header */}
      <AdminHeader
        currentSection={currentSection}
        activeRole={adminRole}
        onSwitchRole={switchAdminRole}
        adminUsers={adminUsers}
        onOpenQuickAction={handleQuickAction}
        onGlobalSearch={setGlobalSearch}
        onRefresh={refreshAll}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <AdminSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          badgeCounts={badgeCounts}
          role={adminRole}
        />

        {/* Main Operational Desk */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* DASHBOARD / OVERVIEW */}
          {currentSection === 'dashboard' && (
            <AdminOverviewDesk
              listings={listings}
              users={users}
              subscriptions={subscriptions}
              transactions={transactions}
              verifications={verifications}
              reports={reports}
              tickets={tickets}
              transfers={transfers}
              auditLogs={auditLogs}
              onNavigate={setCurrentSection}
              onOpenQuickAction={handleQuickAction}
            />
          )}

          {/* LISTINGS */}
          {currentSection === 'marketplace-listings' && (
            <AdminListingsDesk
              listings={listings}
              categories={categories}
              users={users}
              onSaveListing={(l) => { StorageService.saveListing(l); refreshAll(); }}
              onApproveListing={(id) => { StorageService.approveListing(id); refreshAll(); }}
              onRejectListing={(id, reason) => { StorageService.rejectListing(id, reason); refreshAll(); }}
              onSuspendListing={(id, reason) => { StorageService.suspendListing(id, reason); refreshAll(); }}
              onArchiveListing={(id) => { StorageService.archiveListing(id); refreshAll(); }}
              onRestoreListing={(id) => { StorageService.restoreListing(id); refreshAll(); }}
              onSoftDeleteListing={(id) => { StorageService.softDeleteListing(id); refreshAll(); }}
              onToggleFeature={(id, feat) => { StorageService.toggleFeatureListing(id, feat); refreshAll(); }}
              adminName={user?.full_name || 'Admin'}
              canPerform={canPerform}
            />
          )}

          {/* CATEGORIES & ATTRIBUTES */}
          {(currentSection === 'marketplace-categories' || currentSection === 'marketplace-attributes') && (
            <AdminCategoriesDesk
              categories={categories}
              attributes={attributes}
              onSaveCategory={(c) => { StorageService.saveCategory(c); refreshAll(); }}
              onSaveAttribute={(a) => { StorageService.saveCategoryAttribute(a); refreshAll(); }}
              onDeleteAttribute={(id) => { StorageService.deleteCategoryAttribute(id); refreshAll(); }}
              canPerform={canPerform}
            />
          )}

          {/* LOCATIONS */}
          {currentSection === 'marketplace-locations' && (
            <AdminLocationsDesk />
          )}

          {/* USERS / MERCHANTS / BUYERS */}
          {(currentSection === 'users-all' ||
            currentSection === 'users-sellers' ||
            currentSection === 'users-buyers' ||
            currentSection === 'users-suspended' ||
            currentSection === 'marketplace-sellers' ||
            currentSection === 'marketplace-buyers') && (
            <AdminUsersDesk
              users={users}
              listings={listings}
              subscriptions={subscriptions}
              transactions={transactions}
              verifications={verifications}
              onSaveUser={(u) => { StorageService.saveUser(u); refreshAll(); }}
              onSuspendUser={(id, reason) => { StorageService.suspendUser(id, reason); refreshAll(); }}
              onRestoreUser={(id) => { StorageService.restoreUser(id); refreshAll(); }}
              onDeactivateUser={(id) => { StorageService.deactivateUser(id); refreshAll(); }}
              onVerifyUser={(id, method) => { StorageService.verifyUserAccount(id, method as any); refreshAll(); }}
              canPerform={canPerform}
            />
          )}

          {/* MEMBERSHIPS, PLANS & QUOTAS */}
          {(currentSection === 'membership-plans' ||
            currentSection === 'membership-quotas' ||
            currentSection === 'membership-subscriptions') && (
            <AdminMembershipsDesk
              families={families}
              plans={plans}
              subscriptions={subscriptions}
              users={users}
              onSavePlan={(p) => { StorageService.savePlan(p); refreshAll(); }}
              onSaveSubscription={(s) => { StorageService.saveSubscription(s); refreshAll(); }}
              onCreateManualSubscription={(data) => {
                StorageService.createManualSubscription({
                  userId: data.user_id,
                  planId: data.plan_id,
                  planName: data.plan_name || 'Membership Plan',
                  familySlug: data.family_slug || 'general',
                  duration: data.duration_months ? `${data.duration_months}m` : '1m',
                  price: data.price_paid_ngn || 0,
                  reason: data.notes || 'Admin manual subscription grant'
                });
                refreshAll();
              }}
              onUpdateSubscriptionStatus={(id, status) => { StorageService.updateSubscriptionStatus(id, status); refreshAll(); }}
              canPerform={canPerform}
            />
          )}

          {/* PROMOTIONS & CREDITS */}
          {(currentSection === 'promotions-packages' ||
            currentSection === 'promotions-active' ||
            currentSection === 'promotions-credits') && (
            <AdminPromotionsDesk
              promotions={promotions}
              listings={listings}
              creditLedger={creditLedger}
              users={users}
              onGrantCredits={(uid, type, qty, reason) => { StorageService.grantPromotionCredits(uid, type, qty, reason); refreshAll(); }}
              onDeductCredits={(uid, type, qty, reason) => { StorageService.deductPromotionCredits(uid, type, qty, reason); refreshAll(); }}
              canPerform={canPerform}
            />
          )}

          {/* PAYMENTS, BANK TRANSFERS & REFUNDS */}
          {(currentSection === 'payments-transactions' ||
            currentSection === 'payments-transfers' ||
            currentSection === 'payments-refunds') && (
            <AdminPaymentsDesk
              transactions={transactions}
              transfers={transfers}
              refunds={refunds}
              users={users}
              onVerifyTransfer={(id) => { StorageService.verifyBankTransfer(id); refreshAll(); }}
              onRejectTransfer={(id, reason) => { StorageService.rejectBankTransfer(id, reason); refreshAll(); }}
              onCreateRefundRequest={(req) => { StorageService.createRefundRequest(req); refreshAll(); }}
              onUpdateRefundStatus={(id, status, notes) => { StorageService.updateRefundStatus(id, status, notes); refreshAll(); }}
              canPerform={canPerform}
            />
          )}

          {/* VERIFICATIONS KYC */}
          {currentSection === 'users-verification' && (
            <AdminVerificationsDesk />
          )}

          {/* MODERATION & REPORTS */}
          {(currentSection === 'moderation-queue' ||
            currentSection === 'moderation-reviews' ||
            currentSection === 'marketplace-reports') && (
            <AdminModerationDesk />
          )}

          {/* CMS & COMMUNICATIONS */}
          {(currentSection === 'content-banners' ||
            currentSection === 'content-announcements' ||
            currentSection === 'content-pages' ||
            currentSection === 'communication-templates') && (
            <AdminCmsDesk />
          )}

          {/* SUPPORT TICKETS */}
          {currentSection === 'support-tickets' && (
            <AdminSupportDesk />
          )}

          {/* ENGINE SETTINGS & FEATURE FLAGS */}
          {(currentSection === 'config-ranking' ||
            currentSection === 'config-settings' ||
            currentSection === 'config-flags') && (
            <AdminSettingsDesk />
          )}

          {/* RBAC DIRECTORY */}
          {currentSection === 'admin-rbac' && (
            <AdminRbacDesk />
          )}

          {/* AUDIT TRAIL */}
          {currentSection === 'admin-audit' && (
            <AdminAuditLogsDesk />
          )}

          {/* DATA VALIDATION & SPEC CONFLICT RESOLVER */}
          {currentSection === 'admin-validation' && (
            <AdminDataValidationDesk />
          )}

          {/* SYSTEM HEALTH */}
          {currentSection === 'admin-health' && (
            <AdminSystemHealthDesk />
          )}

          {/* EXPORT & IMPORT CENTER */}
          {currentSection === 'reports-export' && (
            <AdminExportCenterDesk />
          )}
        </main>
      </div>

      {/* Global Listing Editor Modal */}
      {isNewListingModalOpen && (
        <AdminListingEditorModal
          listing={editingListing}
          categories={categories}
          users={users}
          onSave={(savedListing) => {
            StorageService.saveListing(savedListing);
            setIsNewListingModalOpen(false);
            setEditingListing(null);
            refreshAll();
          }}
          onClose={() => {
            setIsNewListingModalOpen(false);
            setEditingListing(null);
          }}
          adminName={user?.full_name || 'Tunde Adeleke'}
        />
      )}
    </div>
  );
};
