import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { WalletLedger } from '../../types';

interface WalletCardProps {
  userId: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ userId }) => {
  const balance = StorageService.getUserWalletBalance(userId);
  const entries = StorageService.getWalletEntries().filter(e => e.user_id === userId);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                AMFFL Wallet &amp; Cashback
              </h3>
              <p className="text-[11px] text-slate-500">
                Derived balance for fee discounts &amp; promo credits
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
        </div>

        {/* Balance Display */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50/60 border border-emerald-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Available Wallet Balance
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-emerald-950 font-['Plus_Jakarta_Sans']">
              ₦{balance.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Deductions
            </span>
          </div>
        </div>

        {/* Recent Ledger Transactions */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Ledger Activity
          </span>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {entries.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No wallet activity yet.</p>
            ) : (
              entries.slice(0, 4).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`p-1 rounded-lg ${
                        entry.type === 'credit'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entry.type === 'credit' ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-[11px]">
                        {entry.description}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(entry.created_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-bold shrink-0 text-xs ${
                      entry.type === 'credit' ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {entry.type === 'credit' ? '+' : '-'}₦{entry.amount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Cashback earned on renewals deposits directly into your wallet.</span>
      </div>
    </div>
  );
};
