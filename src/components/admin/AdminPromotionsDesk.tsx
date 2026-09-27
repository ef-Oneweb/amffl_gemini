import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Coins, 
  Clock, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  X, 
  Tag, 
  RotateCcw,
  MessageCircle,
  Percent,
  ArrowUpRight
} from 'lucide-react';
import { 
  PromotionPackage, 
  PromotionCreditLedger, 
  Listing, 
  User 
} from '../../types';

interface AdminPromotionsDeskProps {
  promotions: PromotionPackage[];
  listings: Listing[];
  creditLedger: PromotionCreditLedger[];
  users: User[];
  onGrantCredits: (userId: string, type: string, amount: number, reason: string) => void;
  onDeductCredits: (userId: string, type: string, amount: number, reason: string) => void;
  canPerform: (perm: string) => boolean;
}

export const AdminPromotionsDesk: React.FC<AdminPromotionsDeskProps> = ({
  promotions,
  listings,
  creditLedger,
  users,
  onGrantCredits,
  onDeductCredits,
  canPerform,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'active' | 'ledger'>('packages');

  // Credit Grant Modal
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditUserId, setCreditUserId] = useState(users[0]?.id || 'user-emeka');
  const [creditType, setCreditType] = useState('Featured Ad Credit');
  const [creditAmount, setCreditAmount] = useState('5');
  const [creditReason, setCreditReason] = useState('');
  const [isDeduct, setIsDeduct] = useState(false);

  // Active promotions listings
  const promotedListings = listings.filter(l => l.promotion_type && l.promotion_type !== undefined);

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(creditAmount) || 1;
    if (isDeduct) {
      onDeductCredits(creditUserId, creditType, qty, creditReason.trim() || 'Manual adjustment');
    } else {
      onGrantCredits(creditUserId, creditType, qty, creditReason.trim() || 'Admin customer courtesy grant');
    }
    setCreditModalOpen(false);
    setCreditReason('');
    alert(`${isDeduct ? 'Deducted' : 'Granted'} ${qty} ${creditType} credits successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Promotions &amp; Standalone Boost Packages
          </h2>
          <p className="text-xs text-slate-500">
            Manage promotion types, standalone WhatsApp button addons, Top rank boosts, and promotion credit ledger.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setIsDeduct(false); setCreditModalOpen(true); }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Coins className="w-4 h-4" />
          <span>+ Grant Promotion Credits</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'packages' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Promotion Packages ({promotions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'active' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Ad Boosts ({promotedListings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Promotion Credit Ledger ({creditLedger.length})
        </button>
      </div>

      {/* Sub-Tab 1: Packages */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {pkg.category}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{pkg.type}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] mt-2">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Configured Duration &amp; Rates:
                  </div>
                  {pkg.tier_options.map((opt) => (
                    <div key={opt.id} className="p-2 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{opt.label}</span>
                      <strong className="text-emerald-800 font-extrabold">₦{opt.price.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-emerald-700 font-bold">
                  ✓ Configured in database catalog
                </span>
              </div>
            </div>
          ))}

          {/* Standalone Add-on Highlight Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/40 px-2 py-0.5 rounded-full">
                Standalone Seller Add-on
              </span>
              <h3 className="text-base font-extrabold font-['Plus_Jakarta_Sans'] mt-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Direct WhatsApp Inquiries Button</span>
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Allows Free-tier and Standard merchants to purchase the 1-click WhatsApp inquiry badge at ₦1,500/mo without whole-plan upgrades.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-300">
              Active on all member ad detail views
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Active Promoted Listings */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Listing Title</th>
                  <th className="py-3 px-3">Seller</th>
                  <th className="py-3 px-3">Promotion Type</th>
                  <th className="py-3 px-3">Score Boost</th>
                  <th className="py-3 px-3">Expiry Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promotedListings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <a href={`/marketplace/${l.id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {l.title}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{l.seller_name || 'Seller'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold uppercase text-[10px]">
                        {l.promotion_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">+{l.promotion_score_boost || 25} pts</td>
                    <td className="py-3 px-3 text-slate-500">
                      {l.promotion_expiry_date ? new Date(l.promotion_expiry_date).toLocaleDateString() : 'Active'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        LIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Promotion Credit Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Audit-verified immutable promotional credit transaction ledger</span>
            <button
              type="button"
              onClick={() => { setIsDeduct(true); setCreditModalOpen(true); }}
              className="text-red-600 font-bold hover:underline"
            >
              - Deduct Credits
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-3">Credit Type</th>
                    <th className="py-3 px-3 text-center">Delta</th>
                    <th className="py-3 px-3 text-center">Balance After</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-3">Granted By</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {creditLedger.map((ent) => {
                    const u = users.find(x => x.id === ent.user_id);
                    return (
                      <tr key={ent.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {u?.full_name || ent.user_id}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{ent.credit_type}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`font-black ${ent.delta > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                            {ent.delta > 0 ? `+${ent.delta}` : ent.delta}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                          {ent.balance_after}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{ent.reason}</td>
                        <td className="py-3 px-3 text-slate-500">{ent.granted_by}</td>
                        <td className="py-3 px-3 text-slate-400">{new Date(ent.created_date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Credit Grant/Deduct Modal */}
      {creditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Coins className="w-4 h-4 text-purple-600" />
              <span>{isDeduct ? 'Deduct Promotion Credits' : 'Grant Promotion Credits'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Transactions are written directly to the immutable credit ledger and require an audit reason.
            </p>

            <form onSubmit={handleCreditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select User / Merchant</label>
                <select
                  value={creditUserId}
                  onChange={(e) => setCreditUserId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Credit Type</label>
                <select
                  value={creditType}
                  onChange={(e) => setCreditType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                >
                  <option value="Featured Ad Credit">Featured Ad Credit</option>
                  <option value="Top Rank Promotion Credit">Top Rank Promotion Credit</option>
                  <option value="Urgent Ribbon Credit">Urgent Ribbon Credit</option>
                  <option value="Boosted Ad Credit">Boosted Ad Credit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Reason</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="e.g. Compensation for downtime or annual loyalty bonus"
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCreditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl font-bold shadow-xs ${
                    isDeduct ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isDeduct ? 'Confirm Deduction' : 'Confirm Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
