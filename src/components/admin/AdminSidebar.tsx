import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Crown,
  Flame,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  ShieldAlert,
  BellRing,
  HelpCircle,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Tag,
  Layers,
  MapPin,
  Sliders,
  Award,
  Clock,
  Coins,
  Receipt,
  RotateCcw,
  Landmark,
  Image,
  Megaphone,
  BookOpen,
  LifeBuoy,
  Scale,
  SlidersHorizontal,
  KeyRound,
  History,
  CheckCircle2,
  Activity,
  DownloadCloud
} from 'lucide-react';
import { AdminRole } from '../../types';

export type AdminSectionKey =
  | 'dashboard'
  | 'marketplace-listings'
  | 'marketplace-categories'
  | 'marketplace-attributes'
  | 'marketplace-locations'
  | 'marketplace-sellers'
  | 'marketplace-buyers'
  | 'marketplace-reports'
  | 'membership-plans'
  | 'membership-quotas'
  | 'membership-subscriptions'
  | 'promotions-packages'
  | 'promotions-active'
  | 'promotions-credits'
  | 'users-all'
  | 'users-sellers'
  | 'users-buyers'
  | 'users-verification'
  | 'users-suspended'
  | 'payments-transactions'
  | 'payments-transfers'
  | 'payments-refunds'
  | 'content-banners'
  | 'content-announcements'
  | 'content-pages'
  | 'analytics-overview'
  | 'analytics-sellers'
  | 'moderation-queue'
  | 'moderation-reviews'
  | 'communication-templates'
  | 'support-tickets'
  | 'config-ranking'
  | 'config-settings'
  | 'config-flags'
  | 'admin-rbac'
  | 'admin-audit'
  | 'admin-validation'
  | 'admin-health'
  | 'reports-export';

interface AdminSidebarProps {
  currentSection: AdminSectionKey;
  onSelectSection: (section: AdminSectionKey) => void;
  badgeCounts: {
    pendingListings: number;
    pendingVerifications: number;
    openTickets: number;
    reportedAds: number;
    pendingTransfers: number;
    validationIssues: number;
  };
  role: AdminRole;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
  items: {
    key: AdminSectionKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  badgeCounts,
  role,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    marketplace: false,
    membership: false,
    promotions: false,
    users: false,
    payments: false,
    content: true,
    analytics: true,
    moderation: false,
    communication: true,
    support: false,
    config: true,
    administration: false,
    reports: true,
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: <Store className="w-4 h-4 text-emerald-400" />,
      items: [
        { key: 'marketplace-listings', label: 'All Listings', icon: <Tag className="w-3.5 h-3.5" />, badge: badgeCounts.pendingListings },
        { key: 'marketplace-categories', label: 'Categories & Subcategories', icon: <Layers className="w-3.5 h-3.5" /> },
        { key: 'marketplace-attributes', label: 'Custom Attributes', icon: <Sliders className="w-3.5 h-3.5" /> },
        { key: 'marketplace-locations', label: 'Locations (36 States)', icon: <MapPin className="w-3.5 h-3.5" /> },
        { key: 'marketplace-sellers', label: 'Verified Sellers', icon: <Award className="w-3.5 h-3.5" /> },
        { key: 'marketplace-buyers', label: 'Buyers', icon: <Users className="w-3.5 h-3.5" /> },
        { key: 'marketplace-reports', label: 'Reported Listings', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: badgeCounts.reportedAds },
      ],
    },
    {
      id: 'membership',
      title: 'Membership & Plans',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      items: [
        { key: 'membership-plans', label: 'Families, Plans & Pricing', icon: <Crown className="w-3.5 h-3.5" /> },
        { key: 'membership-quotas', label: 'Listing Quota Matrix', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
        { key: 'membership-subscriptions', label: 'Subscriptions Management', icon: <Clock className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'promotions',
      title: 'Promotions Hub',
      icon: <Flame className="w-4 h-4 text-orange-400" />,
      items: [
        { key: 'promotions-packages', label: 'Promotion Packages', icon: <Sparkles className="w-3.5 h-3.5" /> },
        { key: 'promotions-active', label: 'Active & Scheduled', icon: <Clock className="w-3.5 h-3.5" /> },
        { key: 'promotions-credits', label: 'Promotion Credit Ledger', icon: <Coins className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'users',
      title: 'Users & Identity',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      items: [
        { key: 'users-all', label: 'All Users', icon: <Users className="w-3.5 h-3.5" /> },
        { key: 'users-sellers', label: 'Merchant Sellers', icon: <Store className="w-3.5 h-3.5" /> },
        { key: 'users-verification', label: 'KYC & Verification Desk', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: badgeCounts.pendingVerifications },
        { key: 'users-suspended', label: 'Suspended Accounts', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Treasury',
      icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
      items: [
        { key: 'payments-transactions', label: 'Transactions Ledger', icon: <Receipt className="w-3.5 h-3.5" /> },
        { key: 'payments-transfers', label: 'Bank Transfers Desk', icon: <Landmark className="w-3.5 h-3.5" />, badge: badgeCounts.pendingTransfers },
        { key: 'payments-refunds', label: 'Refunds Workflow', icon: <RotateCcw className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'moderation',
      title: 'Moderation & Safety',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      items: [
        { key: 'moderation-queue', label: 'Listing Review Queue', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: badgeCounts.pendingListings },
        { key: 'moderation-reviews', label: 'Reviews & Feedback', icon: <BookOpen className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'content',
      title: 'Content & CMS',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      items: [
        { key: 'content-banners', label: 'Banners & Promotions', icon: <Image className="w-3.5 h-3.5" /> },
        { key: 'content-announcements', label: 'Announcements', icon: <Megaphone className="w-3.5 h-3.5" /> },
        { key: 'content-pages', label: 'CMS Static Pages', icon: <BookOpen className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'support',
      title: 'Support Desk',
      icon: <LifeBuoy className="w-4 h-4 text-cyan-400" />,
      badge: badgeCounts.openTickets,
      items: [
        { key: 'support-tickets', label: 'Support Tickets', icon: <HelpCircle className="w-3.5 h-3.5" />, badge: badgeCounts.openTickets },
      ],
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: <BellRing className="w-4 h-4 text-yellow-400" />,
      items: [
        { key: 'communication-templates', label: 'Notification Templates', icon: <BellRing className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
      items: [
        { key: 'analytics-overview', label: 'Marketplace & Revenue', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        { key: 'analytics-sellers', label: 'Seller Performance', icon: <Award className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'config',
      title: 'Configuration',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      items: [
        { key: 'config-ranking', label: 'Discovery Ranking Weights', icon: <Scale className="w-3.5 h-3.5" /> },
        { key: 'config-settings', label: 'Marketplace Settings', icon: <Settings className="w-3.5 h-3.5" /> },
        { key: 'config-flags', label: 'Feature Flags', icon: <Sliders className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: <KeyRound className="w-4 h-4 text-red-400" />,
      badge: badgeCounts.validationIssues,
      items: [
        { key: 'admin-rbac', label: 'Admin Users & RBAC', icon: <KeyRound className="w-3.5 h-3.5" /> },
        { key: 'admin-audit', label: 'Immutable Audit Logs', icon: <History className="w-3.5 h-3.5" /> },
        { key: 'admin-validation', label: 'Data Validation Center', icon: <CheckCircle2 className="w-3.5 h-3.5" />, badge: badgeCounts.validationIssues },
        { key: 'admin-health', label: 'System Diagnostics & Health', icon: <Activity className="w-3.5 h-3.5" /> },
      ],
    },
    {
      id: 'reports',
      title: 'Reports & Export',
      icon: <FileSpreadsheet className="w-4 h-4 text-teal-400" />,
      items: [
        { key: 'reports-export', label: 'CSV Export Center', icon: <DownloadCloud className="w-3.5 h-3.5" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 select-none min-h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-950">
              A
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight font-['Plus_Jakarta_Sans']">
              AMFFL Control Center
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Enterprise Admin v2.4</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Top Direct Dashboard Item */}
        <button
          type="button"
          onClick={() => onSelectSection('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            currentSection === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-extrabold'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Master Dashboard</span>
          </div>
          <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400">
            /admin
          </span>
        </button>

        {/* Collapsible Groups */}
        <div className="pt-2 space-y-1">
          {navGroups.map((group) => {
            const isCollapsed = !!collapsedGroups[group.id];
            const hasActiveChild = group.items.some(it => it.key === currentSection);
            const totalGroupBadge = group.items.reduce((sum, it) => sum + (it.badge || 0), 0) || group.badge || 0;

            return (
              <div key={group.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    hasActiveChild ? 'text-emerald-400 bg-slate-900/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {group.icon}
                    <span className="text-[11px] font-bold uppercase tracking-wider">{group.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {totalGroupBadge > 0 && (
                      <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                        {totalGroupBadge}
                      </span>
                    )}
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Group Children */}
                {!isCollapsed && (
                  <div className="pl-4 pr-1 py-0.5 space-y-0.5 border-l border-slate-800/80 ml-4">
                    {group.items.map((item) => {
                      const isActive = currentSection === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => onSelectSection(item.key)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            isActive
                              ? 'bg-emerald-600/90 text-white font-bold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={isActive ? 'text-white' : 'text-slate-500'}>
                              {item.icon}
                            </span>
                            <span className="truncate text-[11px]">{item.label}</span>
                          </div>

                          {item.badge !== undefined && item.badge > 0 && (
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? 'bg-white text-emerald-900'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Role Indicator */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Current RBAC Role:</span>
          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </aside>
  );
};
