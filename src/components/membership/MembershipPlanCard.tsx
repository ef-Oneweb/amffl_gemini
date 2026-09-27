import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Wallet } from 'lucide-react';
import { MembershipPlan, PlanDuration } from '../../types';
import { getPlanPriceForDuration } from '../../services/membershipService';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  duration: PlanDuration;
  isCompared: boolean;
  onToggleCompare: (planId: string) => void;
  onSubscribe: (plan: MembershipPlan) => void;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({
  plan,
  duration,
  isCompared,
  onToggleCompare,
  onSubscribe,
}) => {
  const [showFullQuotas, setShowFullQuotas] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(true);

  const price = getPlanPriceForDuration(plan, duration);
  const isFree = plan.is_free;

  // Header styling per tier level
  const getHeaderColor = () => {
    if (plan.tier_level === 0) return 'bg-slate-50 border-slate-200 text-slate-800';
    if (plan.tier_level <= 2) return 'bg-amber-50/80 border-amber-200 text-amber-900';
    if (plan.tier_level <= 4) return 'bg-blue-50/80 border-blue-200 text-blue-900';
    if (plan.tier_level <= 6) return 'bg-pink-50/80 border-pink-200 text-pink-900';
    return 'bg-purple-50/80 border-purple-200 text-purple-900';
  };

  const quotaKeys = Object.keys(plan.listing_limits || {});
  const displayedQuotas = showFullQuotas ? quotaKeys : quotaKeys.slice(0, 3);

  return (
    <div className={`relative bg-white rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-card-hover ${
      isCompared ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
    }`}>
      {/* Top Header Card */}
      <div className={`p-5 border-b ${getHeaderColor()}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              {plan.name}
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {plan.tier_level > 0 ? `${plan.visibility_multiplier} more clients` : '1x visibility'}
            </p>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-500 hover:text-emerald-700 select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare(plan.id)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Compare</span>
          </label>
        </div>

        {/* 3-Pill Stats Metric Bar matching Screenshot 2 */}
        <div className="mt-4 grid grid-cols-3 gap-1 bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-slate-200/70 text-center">
          <div className="border-r border-slate-100 pr-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Visibility
            </span>
            <span className="block text-xs font-black text-slate-900 truncate">
              {plan.visibility_multiplier}
            </span>
          </div>

          <div className="border-r border-slate-100 px-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Featured
            </span>
            <span className="block text-xs font-black text-slate-900 truncate">
              {plan.featured_ads}
            </span>
          </div>

          <div className="pl-1">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Auto-Renew
            </span>
            <span className="block text-xs font-black text-slate-900 truncate">
              {plan.renewal_interval.replace('Every ', '').slice(0, 10)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Body */}
      <div className="p-5 flex-1 space-y-4">
        {/* Listings Quota Section */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Listings Quota:</span>
            {quotaKeys.length > 3 && (
              <button
                type="button"
                onClick={() => setShowFullQuotas(!showFullQuotas)}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                {showFullQuotas ? (
                  <>Hide list <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Show full ({quotaKeys.length}) <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {displayedQuotas.map((catKey) => (
              <div key={catKey} className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="truncate max-w-[130px]">{catKey}</span>
                <span className="font-extrabold text-slate-900">
                  {typeof plan.listing_limits[catKey] === 'number'
                    ? `${plan.listing_limits[catKey]} ads`
                    : plan.listing_limits[catKey]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Checklist */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span>Features Included:</span>
            {/* 5-dot rating indicator matching Screenshot 2 */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div
                  key={dot}
                  className={`w-1.5 h-1.5 rounded-full ${
                    dot <= plan.feature_level ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-600">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cashback Incentive Pill */}
        {plan.cashback && plan.cashback !== '0%' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{plan.cashback} Cashback into Wallet</span>
          </div>
        )}
      </div>

      {/* Pricing and Subscribe Button Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-white">
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              {isFree ? 'Free' : `₦${price.toLocaleString()}`}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {duration === '1m' ? '1 Month' : duration === '3m' ? '3 Months' : duration === '6m' ? '6 Months' : '1 Year'}
            </span>
          </div>
          {duration !== '1m' && !isFree && (
            <p className="text-[10px] text-emerald-700 font-semibold">
              ≈ ₦{Math.round(price / (duration === '3m' ? 3 : duration === '6m' ? 6 : 12)).toLocaleString()} / month
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSubscribe(plan)}
          className={`w-full py-3.5 rounded-full font-extrabold text-xs shadow-md transition-all active:scale-[0.98] ${
            isFree
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-800/20'
          }`}
        >
          {isFree ? 'Activate Free' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
};
