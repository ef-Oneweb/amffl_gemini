import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { User, SellerVerification } from '../../types';

interface VerificationCardProps {
  user: User;
  verification?: SellerVerification;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ user, verification }) => {
  const isVerified = user.is_verified || verification?.status === 'approved';
  const isSubmitted = verification?.status === 'submitted' || verification?.status === 'pending';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                Seller Verification
              </h3>
              <p className="text-[11px] text-slate-500">Government identity verification status</p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isVerified
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isSubmitted
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isVerified ? 'Verified' : isSubmitted ? 'In Review' : 'Unverified'}
          </span>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          {isVerified ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Identity Fully Confirmed
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your listings display the official AMFFL Verified badge and receive a +25 trust boost in search rankings.
              </p>
            </div>
          ) : isSubmitted ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Under Administrative Review
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your NIN/BVN documents have been submitted and are being checked by the AMFFL verification desk.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Get Verified for +25 Ranking Boost
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Submit your 11-digit NIN, BVN or official CAC business documents to gain buyer trust and sell 3x faster.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <Link
          to="/verify"
          className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span>{isVerified ? 'View Verification Details' : 'Verify Identity Now'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
