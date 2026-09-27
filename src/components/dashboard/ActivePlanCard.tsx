import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Calendar, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Subscription, MembershipPlan } from '../../types';

interface ActivePlanCardProps {
  subscription?: Subscription;
  plan?: MembershipPlan;
}

export const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ subscription, plan }) => {
  if (!subscription || !plan) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md border border-slate-700/80 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> No Active Membership Plan
          </div>
          <h3 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">
            Boost Your Sales with a Plan
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Subscribe to an AMFFL Membership Plan to get listing quotas, up to 320x visibility, featured slots, and a verified trust badge.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/80">
          <Link
            to="/premium-services"
            className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Explore Membership Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const expiry = new Date(subscription.expiry_date);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-gradient-to-br from-[#0c5c36] via-[#11693e] to-[#084226] text-white rounded-3xl p-6 shadow-xl border border-emerald-600/50 flex flex-col justify-between relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold tracking-wide backdrop-blur-xs">
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Active Subscription</span>
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[11px] font-black uppercase tracking-wider">
            {subscription.status}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {plan.name}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5 capitalize">
            {subscription.family_slug} Membership Family • {plan.visibility_multiplier} Visibility
          </p>
        </div>

        {/* Days remaining badge */}
        <div className="bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-100">Expires: {expiry.toLocaleDateString()}</span>
          </div>
          <span className="font-extrabold text-amber-300">
            {diffDays} {diffDays === 1 ? 'day' : 'days'} left
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-emerald-700/60 flex items-center justify-between gap-3">
        <div className="text-[11px] text-emerald-200">
          Ref: <span className="font-mono text-white text-[10px]">{subscription.payment_reference.slice(0, 16)}...</span>
        </div>
        <Link
          to={`/membership/${subscription.family_slug}`}
          className="px-4 py-2 rounded-full bg-white text-emerald-900 font-extrabold text-xs shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span>Upgrade Tier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
