import React from 'react';
import { X, Check, Minus, Columns3, ArrowRight } from 'lucide-react';
import { MembershipPlan, PlanDuration } from '../../types';
import { getPlanPriceForDuration } from '../../services/membershipService';

interface ComparePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: MembershipPlan[];
  duration: PlanDuration;
  onSelectPlan: (plan: MembershipPlan) => void;
  onClearCompare: () => void;
}

export const ComparePlansModal: React.FC<ComparePlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  duration,
  onSelectPlan,
  onClearCompare,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Columns3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Compare Membership Plans
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating {plans.length} selected tiers side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
            >
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {plans.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-600 font-bold text-sm">No plans selected for comparison</p>
              <p className="text-xs text-slate-400">
                Click the &quot;Compare&quot; checkbox on any plan cards to view them side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-500 uppercase tracking-wider w-1/4">
                      Plan Details
                    </th>
                    {plans.map((p) => {
                      const price = getPlanPriceForDuration(p, duration);
                      return (
                        <th key={p.id} className="p-3 text-center">
                          <span className="block font-black text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                            {p.name}
                          </span>
                          <span className="block text-base font-extrabold text-emerald-700 mt-1">
                            {p.is_free ? 'Free' : `₦${price.toLocaleString()}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectPlan(p);
                            }}
                            className="mt-2 w-full py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Select Plan
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Visibility Multiplier</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold text-slate-900">
                        {p.visibility_multiplier}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Featured Ads Included</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center font-bold text-slate-900">
                        {p.featured_ads} slots
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Auto-Renewal Frequency</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center text-slate-700">
                        {p.renewal_interval}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Cashback Reward</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center text-emerald-700 font-bold">
                        {p.cashback || 'None'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Seller Trust Badge</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-center font-semibold text-purple-800">
                        {p.badge || 'Standard'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Top Feature Highlights</td>
                    {plans.map((p) => (
                      <td key={p.id} className="p-3 text-left">
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {p.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
