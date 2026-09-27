import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Shield, 
  RefreshCw, 
  CheckCircle2, 
  ChevronRight, 
  Tag, 
  Users, 
  Crown, 
  Coins, 
  Image, 
  Megaphone, 
  Landmark, 
  ExternalLink 
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';
import { AdminSectionKey } from './AdminSidebar';

interface AdminHeaderProps {
  currentSection: AdminSectionKey;
  activeRole: AdminRole;
  onSwitchRole: (role: AdminRole) => void;
  adminUsers: AdminUser[];
  onOpenQuickAction: (action: string) => void;
  onGlobalSearch: (query: string) => void;
  onRefresh: () => void;
}

const SECTION_TITLES: Record<AdminSectionKey, { section: string; title: string }> = {
  'dashboard': { section: 'Administration', title: 'Master Operations Dashboard' },
  'marketplace-listings': { section: 'Marketplace', title: 'Classified Listings Management' },
  'marketplace-categories': { section: 'Marketplace', title: 'Categories & Subcategories Taxonomy' },
  'marketplace-attributes': { section: 'Marketplace', title: 'Custom Category Attributes' },
  'marketplace-locations': { section: 'Marketplace', title: 'Locations & States Management' },
  'marketplace-sellers': { section: 'Marketplace', title: 'Merchant Sellers Directory' },
  'marketplace-buyers': { section: 'Marketplace', title: 'Registered Buyers' },
  'marketplace-reports': { section: 'Marketplace', title: 'Reported Listings Desk' },
  'membership-plans': { section: 'Membership', title: 'Membership Families & Pricing' },
  'membership-quotas': { section: 'Membership', title: 'Listing Quotas Visual Matrix' },
  'membership-subscriptions': { section: 'Membership', title: 'Subscriptions Management' },
  'promotions-packages': { section: 'Promotions', title: 'Standalone Promotion Packages' },
  'promotions-active': { section: 'Promotions', title: 'Active & Scheduled Boosts' },
  'promotions-credits': { section: 'Promotions', title: 'Promotion Credit Ledger' },
  'users-all': { section: 'Users & Identity', title: 'User Accounts Directory' },
  'users-sellers': { section: 'Users & Identity', title: 'Sellers Directory' },
  'users-buyers': { section: 'Users & Identity', title: 'Buyers Directory' },
  'users-verification': { section: 'Users & Identity', title: 'KYC & Seller Verification Desk' },
  'users-suspended': { section: 'Users & Identity', title: 'Suspended Accounts' },
  'payments-transactions': { section: 'Payments & Treasury', title: 'Financial Transactions Ledger' },
  'payments-transfers': { section: 'Payments & Treasury', title: 'Bank Transfers Reconciliation' },
  'payments-refunds': { section: 'Payments & Treasury', title: 'Refund Requests Workflow' },
  'content-banners': { section: 'Content & CMS', title: 'Marketplace Banners' },
  'content-announcements': { section: 'Content & CMS', title: 'Announcements Manager' },
  'content-pages': { section: 'Content & CMS', title: 'CMS Static Pages & Policy' },
  'analytics-overview': { section: 'Analytics', title: 'Marketplace & Revenue Analytics' },
  'analytics-sellers': { section: 'Analytics', title: 'Seller Performance Metrics' },
  'moderation-queue': { section: 'Moderation & Safety', title: 'Listing Review Queue' },
  'moderation-reviews': { section: 'Moderation & Safety', title: 'Customer Reviews & Feedback' },
  'communication-templates': { section: 'Communication', title: 'Notification & SMS Templates' },
  'support-tickets': { section: 'Support Desk', title: 'Customer Support Tickets' },
  'config-ranking': { section: 'Configuration', title: 'Search & Discovery Ranking Weights' },
  'config-settings': { section: 'Configuration', title: 'Global Marketplace Settings' },
  'config-flags': { section: 'Configuration', title: 'Platform Feature Flags' },
  'admin-rbac': { section: 'Administration', title: 'Admin Users & RBAC Permissions' },
  'admin-audit': { section: 'Administration', title: 'Immutable System Audit Logs' },
  'admin-validation': { section: 'Administration', title: 'Data Validation Center (Conflict Resolver)' },
  'admin-health': { section: 'Administration', title: 'System Diagnostics & Health' },
  'reports-export': { section: 'Reports & Export', title: 'CSV Data Export Center' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSection,
  activeRole,
  onSwitchRole,
  adminUsers,
  onOpenQuickAction,
  onGlobalSearch,
  onRefresh,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const meta = SECTION_TITLES[currentSection] || { section: 'Admin', title: 'Control Center' };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGlobalSearch(searchVal.trim());
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Control Center</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-700">{meta.section}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">{meta.title}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight mt-0.5">
            {meta.title}
          </h1>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search listings, users, refs..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>

          {/* Role Switcher (For testing RBAC live) */}
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => onSwitchRole(e.target.value as AdminRole)}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="super_admin">Super Admin (All Privileges)</option>
              <option value="marketplace_admin">Marketplace Admin</option>
              <option value="listing_moderator">Listing Moderator</option>
              <option value="membership_admin">Membership Admin</option>
              <option value="finance_admin">Finance Admin</option>
              <option value="promotion_admin">Promotion Admin</option>
              <option value="verification_admin">Verification Admin</option>
              <option value="support_admin">Support Admin</option>
              <option value="content_admin">Content Admin</option>
              <option value="analytics_admin">Analytics Admin</option>
              <option value="read_only_admin">Read-Only Auditor</option>
            </select>
          </div>

          {/* Quick Action Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Action</span>
            </button>

            {quickActionOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setQuickActionOpen(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Create / Manage
                </div>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('new-listing')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>+ Post New Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('new-user')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>+ Create User / Seller</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('new-plan')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>+ Create Membership Plan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('grant-credits')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Coins className="w-4 h-4 text-purple-600" />
                  <span>+ Issue Promotion Credits</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('new-banner')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Image className="w-4 h-4 text-pink-600" />
                  <span>+ Add Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('send-broadcast')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Megaphone className="w-4 h-4 text-orange-600" />
                  <span>+ Send Broadcast Notice</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenQuickAction('manual-subscription')}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span>+ Manual Subscription</span>
                </button>
              </div>
            )}
          </div>

          {/* Refresh State Button */}
          <button
            type="button"
            onClick={handleRefreshClick}
            title="Refresh application state"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
