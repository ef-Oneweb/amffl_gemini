import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Crown, ArrowRight, LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || 'PSTK_DIRECT_SETTLEMENT';
  const planId = searchParams.get('planId');

  const plan = planId ? StorageService.getPlans().find(p => p.id === planId) : undefined;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Transaction Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          Payment Successful!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for your payment. Your AMFFL service has been activated and your invoice is recorded.
        </p>
      </div>

      {/* Payment Receipt Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-left text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400">Payment Reference:</span>
          <span className="font-mono font-bold text-slate-900">{reference}</span>
        </div>

        {plan && (
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-400">Activated Plan:</span>
            <span className="font-extrabold text-emerald-800">{plan.name}</span>
          </div>
        )}

        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400">Gateway:</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Paystack Secured
          </span>
        </div>

        <div className="flex justify-between py-1.5">
          <span className="text-slate-400">Status:</span>
          <span className="font-bold text-emerald-700 uppercase">Settled &amp; Active</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Member Dashboard</span>
        </Link>

        <Link
          to="/sell"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your First Ad Now</span>
        </Link>
      </div>
    </div>
  );
};
