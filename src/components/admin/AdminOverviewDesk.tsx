import React from 'react';
import { 
  Users, 
  Store, 
  Tag, 
  Crown, 
  CreditCard, 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Landmark,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  Listing, 
  User, 
  Subscription, 
  Transaction, 
  SellerVerification, 
  ListingReport, 
  SupportTicket, 
  BankTransferRecord,
  AuditLog
} from '../../types';
import { AdminSectionKey } from './AdminSidebar';

interface AdminOverviewDeskProps {
  listings: Listing[];
  users: User[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  verifications: SellerVerification[];
  reports: ListingReport[];
  tickets: SupportTicket[];
  transfers: BankTransferRecord[];
  auditLogs: AuditLog[];
  onNavigate: (section: AdminSectionKey) => void;
  onOpenQuickAction: (action: string) => void;
}

export const AdminOverviewDesk: React.FC<AdminOverviewDeskProps> = ({
  listings,
  users,
  subscriptions,
  transactions,
  verifications,
  reports,
  tickets,
  transfers,
  auditLogs,
  onNavigate,
  onOpenQuickAction,
}) => {
  // Aggregate Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'suspended' && u.status !== 'deactivated').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const verifiedUsers = users.filter(u => u.is_verified).length;

  const sellers = users.filter(u => u.role === 'user' && (u.company_name || u.tier_badge !== 'Standard' || listings.some(l => l.user_id === u.id)));
  const pendingVerifications = verifications.filter(v => v.status === 'pending' || v.status === 'submitted').length;

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active' && (!l.extended_status || l.extended_status === 'active')).length;
  const pendingListings = listings.filter(l => l.extended_status === 'pending' || l.status === 'draft').length;
  const rejectedListings = listings.filter(l => l.extended_status === 'rejected').length;
  const featuredListings = listings.filter(l => l.is_featured).length;
  const promotedListings = listings.filter(l => l.promotion_type && l.promotion_type !== undefined).length;
  const openReports = reports.filter(r => r.status === 'open').length;

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const now = new Date();
  const expiringSoonSubs = subscriptions.filter(s => {
    if (s.status !== 'active') return false;
    const diffDays = (new Date(s.expiry_date).getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // Revenue Aggregation
  const successfulTx = transactions.filter(t => t.status === 'success');
  const totalRevenue = successfulTx.reduce((sum, t) => sum + (t.amount || 0), 0) + 
    transfers.filter(tr => tr.status === 'verified').reduce((sum, tr) => sum + tr.amount, 0);

  const subRevenue = successfulTx.filter(t => t.purpose === 'subscription').reduce((sum, t) => sum + t.amount, 0) +
    transfers.filter(tr => tr.status === 'verified' && tr.purpose === 'subscription').reduce((sum, tr) => sum + tr.amount, 0);

  const promoRevenue = successfulTx.filter(t => t.purpose === 'promotion').reduce((sum, t) => sum + t.amount, 0) +
    transfers.filter(tr => tr.status === 'verified' && tr.purpose === 'promotion').reduce((sum, tr) => sum + tr.amount, 0);

  const pendingTransfers = transfers.filter(t => t.status === 'pending').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'assigned' || t.status === 'waiting_for_user').length;

  return (
    <div className="space-y-6">
      {/* Action Required Banner Bar (Pending items) */}
      {(pendingListings > 0 || pendingVerifications > 0 || pendingTransfers > 0 || openTicketsCount > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Operational Tasks Requiring Attention
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-800 mt-1">
                {pendingListings > 0 && (
                  <button 
                    onClick={() => onNavigate('moderation-queue')}
                    className="font-bold underline hover:text-amber-950"
                  >
                    • {pendingListings} listing(s) pending review
                  </button>
                )}
                {pendingVerifications > 0 && (
                  <button 
                    onClick={() => onNavigate('users-verification')}
                    className="font-bold underline hover:text-amber-950"
                  >
                    • {pendingVerifications} seller verification(s) awaiting KYC
                  </button>
                )}
                {pendingTransfers > 0 && (
                  <button 
                    onClick={() => onNavigate('payments-transfers')}
                    className="font-bold underline hover:text-amber-950"
                  >
                    • {pendingTransfers} bank transfer(s) awaiting reconciliation
                  </button>
                )}
                {openTicketsCount > 0 && (
                  <button 
                    onClick={() => onNavigate('support-tickets')}
                    className="font-bold underline hover:text-amber-950"
                  >
                    • {openTicketsCount} support ticket(s) unresolved
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('moderation-queue')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Review Queues →
          </button>
        </div>
      )}

      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue (NGN)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Subs: ₦{subRevenue.toLocaleString()}</span>
            <span>Boosts: ₦{promoRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Active Listings Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Marketplace Ads</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              {activeListings}
            </span>
            <span className="text-xs text-slate-500">/ {totalListings} total</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{featuredListings} Featured</span>
            <span>{promotedListings} Promoted</span>
          </div>
        </div>

        {/* Active Memberships Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Crown className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              {activeSubscriptions}
            </span>
            <span className="text-xs text-emerald-600 font-bold">Paid Merchants</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{expiringSoonSubs} expiring this week</span>
            <button onClick={() => onNavigate('membership-subscriptions')} className="underline font-bold">Manage</button>
          </div>
        </div>

        {/* Verified Sellers Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Sellers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              {verifiedUsers}
            </span>
            <span className="text-xs text-slate-500">/ {totalUsers} users</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{pendingVerifications} in KYC queue</span>
            <button onClick={() => onNavigate('users-verification')} className="text-emerald-700 font-bold underline">Review</button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left Revenue & Statistics, Right Real-time Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Department Distribution & Quick Health */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Operation Cards Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                AMFFL Operational Hubs
              </h2>
              <span className="text-xs text-slate-400">Direct Jump</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('marketplace-listings')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Listings Desk</div>
                <div className="text-[10px] text-slate-500">{totalListings} total posted</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('membership-plans')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800">Plans &amp; Pricing</div>
                <div className="text-[10px] text-slate-500">5 Families, 15+ Tiers</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('users-verification')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-800">KYC Verification</div>
                <div className="text-[10px] text-slate-500">{pendingVerifications} awaiting review</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('payments-transfers')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Bank Transfers</div>
                <div className="text-[10px] text-slate-500">{pendingTransfers} pending check</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('content-banners')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-purple-800">Banners &amp; CMS</div>
                <div className="text-[10px] text-slate-500">Promotions &amp; Pages</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin-audit')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Audit Trail</div>
                <div className="text-[10px] text-slate-500">{auditLogs.length} immutable events</div>
              </button>
            </div>
          </div>

          {/* Department Breakdown / Listing Status Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Marketplace Integrity &amp; Status Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                <div className="text-xl font-black text-emerald-800">{activeListings}</div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active Published</div>
              </div>
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-100">
                <div className="text-xl font-black text-amber-800">{pendingListings}</div>
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Review</div>
              </div>
              <div className="p-3 bg-red-50/80 rounded-2xl border border-red-100">
                <div className="text-xl font-black text-red-800">{rejectedListings}</div>
                <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Rejected Ads</div>
              </div>
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100">
                <div className="text-xl font-black text-purple-800">{openReports}</div>
                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Reported Flags</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Immutable Audit Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Live Audit Stream
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('admin-audit')}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 mt-4 space-y-3 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
            {auditLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] text-slate-800 font-medium">
                  {log.reason}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                  <span>By: <strong className="text-slate-700">{log.admin_name}</strong></span>
                  <span className="font-mono text-[9px] text-slate-400">{log.entity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
