import React, { useState } from 'react';
import { MembershipPlan } from '../../types';
import { StorageService } from '../../services/storageService';
import { Edit3, Check, DollarSign } from 'lucide-react';

export const PlansManager: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>(() => StorageService.getPlans());
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const refresh = () => setPlans(StorageService.getPlans());

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    StorageService.savePlan(editingPlan);
    refresh();
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
            Membership Plans &amp; Pricing Tiers ({plans.length})
          </h3>
          <p className="text-xs text-slate-500">Configure prices, durations, featured ad allowances and wallet cashback</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Plan Name / Family</th>
              <th className="py-2.5 px-3">1 Month (₦)</th>
              <th className="py-2.5 px-3">3 Months (₦)</th>
              <th className="py-2.5 px-3">6 Months (₦)</th>
              <th className="py-2.5 px-3">12 Months (₦)</th>
              <th className="py-2.5 px-3">Visibility</th>
              <th className="py-2.5 px-3">Featured Ads</th>
              <th className="py-2.5 px-3">Cashback</th>
              <th className="py-2.5 px-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-3">
                  <span className="font-extrabold text-slate-900 block">{p.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{p.family_slug}</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  {p.is_free ? 'Free' : `₦${p.monthly_price.toLocaleString()}`}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">
                  {p.is_free ? '—' : `₦${p.price_3m.toLocaleString()}`}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">
                  {p.is_free ? '—' : `₦${p.price_6m.toLocaleString()}`}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">
                  {p.is_free ? '—' : `₦${p.price_12m.toLocaleString()}`}
                </td>
                <td className="py-3 px-3 font-bold text-emerald-700">{p.visibility_multiplier}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{p.featured_ads} slots</td>
                <td className="py-3 px-3 font-semibold text-purple-700">{p.cashback || '0%'}</td>
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => setEditingPlan({ ...p })}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Plan Dialog */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Edit Plan: {editingPlan.name}
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Price (₦)</label>
                  <input
                    type="number"
                    value={editingPlan.monthly_price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthly_price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3 Months Price (₦)</label>
                  <input
                    type="number"
                    value={editingPlan.price_3m}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price_3m: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6 Months Price (₦)</label>
                  <input
                    type="number"
                    value={editingPlan.price_6m}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price_6m: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">12 Months Price (₦)</label>
                  <input
                    type="number"
                    value={editingPlan.price_12m}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price_12m: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Featured Ads Included</label>
                  <input
                    type="number"
                    value={editingPlan.featured_ads}
                    onChange={(e) => setEditingPlan({ ...editingPlan, featured_ads: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cashback Reward</label>
                  <input
                    type="text"
                    value={editingPlan.cashback}
                    onChange={(e) => setEditingPlan({ ...editingPlan, cashback: e.target.value })}
                    placeholder="e.g. 5% or ₦1,000"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Visibility Multiplier</label>
                <input
                  type="text"
                  value={editingPlan.visibility_multiplier}
                  onChange={(e) => setEditingPlan({ ...editingPlan, visibility_multiplier: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
