import React, { useState } from 'react';
import { Receipt, FileText, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              Payment &amp; Invoice History
            </h3>
            <p className="text-[11px] text-slate-500">Paystack transactions and official tax receipts</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Invoice #</th>
              <th className="py-2.5 px-3">Item / Service</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No payment transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {tx.invoice_number || `INV-${tx.id.slice(-6)}`}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {tx.plan_name || tx.promotion_package || 'AMFFL Service'}
                    {tx.duration && <span className="text-[11px] text-slate-400 block font-normal capitalize">{tx.duration} term</span>}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {new Date(tx.paid_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Official AMFFL Receipt
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
                  {selectedTx.invoice_number || `INV-${selectedTx.id.slice(-6)}`}
                </h4>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Customer Email:</span>
                <span className="font-semibold text-slate-800">{selectedTx.customer_email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Payment Reference:</span>
                <span className="font-mono text-slate-800">{selectedTx.paystack_reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-slate-800">
                  {selectedTx.plan_name || selectedTx.promotion_package}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Date Paid:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedTx.paid_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm">
                <span className="font-bold text-slate-900">Total Paid:</span>
                <span className="font-black text-emerald-700 text-base">
                  ₦{selectedTx.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Processed securely via Paystack Payment Gateway</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
