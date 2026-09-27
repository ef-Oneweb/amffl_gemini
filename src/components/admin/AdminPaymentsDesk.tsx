import React, { useState } from 'react';
import { 
  CreditCard, 
  Receipt, 
  Landmark, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  Transaction, 
  BankTransferRecord, 
  RefundRequest, 
  User 
} from '../../types';

interface AdminPaymentsDeskProps {
  transactions: Transaction[];
  transfers: BankTransferRecord[];
  refunds: RefundRequest[];
  users: User[];
  onVerifyTransfer: (id: string) => void;
  onRejectTransfer: (id: string, reason: string) => void;
  onCreateRefundRequest: (req: any) => void;
  onUpdateRefundStatus: (id: string, status: any, notes?: string) => void;
  canPerform: (perm: string) => boolean;
}

export const AdminPaymentsDesk: React.FC<AdminPaymentsDeskProps> = ({
  transactions,
  transfers,
  refunds,
  users,
  onVerifyTransfer,
  onRejectTransfer,
  onCreateRefundRequest,
  onUpdateRefundStatus,
  canPerform,
}) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'transfers' | 'refunds'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState(transactions[0]?.id || '');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('5000');

  // Reject Transfer Modal
  const [rejectTransferModalOpen, setRejectTransferModalOpen] = useState(false);
  const [rejectTransferId, setRejectTransferId] = useState<string | null>(null);
  const [rejectTransferReason, setRejectTransferReason] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.paystack_reference.toLowerCase().includes(q) ||
      t.customer_email.toLowerCase().includes(q) ||
      (t.plan_name || '').toLowerCase().includes(q)
    );
  });

  const handleOpenRefundModal = (tx?: Transaction) => {
    if (tx) {
      setSelectedTxId(tx.id);
      setRefundAmount(tx.amount.toString());
    }
    setRefundModalOpen(true);
  };

  const handleSubmitRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId || !refundReason.trim()) return;

    const tx = transactions.find(t => t.id === selectedTxId);
    const u = users.find(x => x.id === tx?.user_id) || users[0];

    onCreateRefundRequest({
      transaction_id: selectedTxId,
      user_id: u?.id || 'unknown',
      user_name: u?.full_name || 'Customer',
      user_email: tx?.customer_email || u?.email || 'customer@amffl.ng',
      amount: Number(refundAmount) || 5000,
      currency: 'NGN',
      reason: refundReason.trim(),
      provider: 'paystack',
      requested_by: 'Finance Admin',
    });

    setRefundModalOpen(false);
    setRefundReason('');
    alert('Refund request logged. Moving to approval queue.');
  };

  const handleConfirmRejectTransfer = () => {
    if (!rejectTransferId || !rejectTransferReason.trim()) return;
    onRejectTransfer(rejectTransferId, rejectTransferReason.trim());
    setRejectTransferModalOpen(false);
    setRejectTransferId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Payments, Treasury &amp; Reconciliation
          </h2>
          <p className="text-xs text-slate-500">
            Authoritative financial ledger. Direct editing of gateway transactions is restricted to preserve audit integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenRefundModal()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>+ Request Refund</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transactions' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Gateway Transactions ({transactions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transfers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bank Transfers Desk ({transfers.filter(t => t.status === 'pending').length} pending)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'refunds' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Refunds Workflow ({refunds.length})
        </button>
      </div>

      {/* Sub-Tab 1: Gateway Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500 font-semibold">
              Authoritative Paystack transaction records
            </div>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, email..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Reference / Invoice</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-3">Purpose</th>
                    <th className="py-3 px-3">Customer Email</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        <div>{tx.paystack_reference}</div>
                        <div className="text-[10px] text-slate-400">{tx.invoice_number}</div>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 capitalize font-medium text-slate-700">
                        {tx.purpose}: <span className="font-bold text-emerald-800">{tx.plan_name || tx.promotion_package || 'General'}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{tx.customer_email}</td>
                      <td className="py-3 px-3 text-slate-500">{new Date(tx.paid_at).toLocaleDateString()}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          tx.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                          tx.status === 'refunded' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenRefundModal(tx)}
                          className="text-[11px] font-bold text-amber-700 hover:underline"
                        >
                          Request Refund
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Bank Transfers Reconciliation */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Merchant / Sender</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-3">Purpose &amp; Package</th>
                  <th className="py-3 px-3">Bank &amp; Reference</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tr.user_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Sender: {tr.sender_name}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      ₦{tr.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-emerald-800">{tr.plan_or_package}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{tr.purpose}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{tr.bank_name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{tr.transaction_reference}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{new Date(tr.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        tr.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        tr.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tr.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {tr.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onVerifyTransfer(tr.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Verify &amp; Credit
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRejectTransferId(tr.id); setRejectTransferReason(''); setRejectTransferModalOpen(true); }}
                            className="px-2 py-1 text-red-600 hover:underline font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          {tr.verified_by ? `By ${tr.verified_by}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Refunds Workflow */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-3">Gateway</th>
                  <th className="py-3 px-3">Requested Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Workflow Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ref.user_name}</div>
                      <div className="text-[10px] text-slate-400">{ref.user_email}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      ₦{ref.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{ref.reason}</td>
                    <td className="py-3 px-3 capitalize font-mono text-[11px] text-slate-600">{ref.provider}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(ref.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        ref.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        ref.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        ref.status === 'requested' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ref.status === 'requested' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRefundStatus(ref.id, 'approved', 'Approved by finance administrator')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px]"
                        >
                          Approve Refund
                        </button>
                      )}
                      {ref.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => onUpdateRefundStatus(ref.id, 'completed', 'Refund settled back to customer bank')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Log Refund Request Workflow</span>
            </h3>
            <p className="text-xs text-slate-500">
              Refunds require two-step approval and generate an immutable financial audit log.
            </p>

            <form onSubmit={handleSubmitRefund} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Gateway Transaction</label>
                <select
                  value={selectedTxId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTxId(id);
                    const tx = transactions.find(t => t.id === id);
                    if (tx) setRefundAmount(tx.amount.toString());
                  }}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {transactions.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.paystack_reference} - ₦{t.amount.toLocaleString()} ({t.customer_email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Refund Amount (₦ NGN)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Refund</label>
                <textarea
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Duplicate debit or authorized plan cancellation within 24h grace window"
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Transfer Modal */}
      {rejectTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans'] text-red-600">
              Reject Bank Transfer Receipt
            </h3>
            <p className="text-xs text-slate-500">
              Specify the reason why this bank transfer cannot be confirmed in the treasury records.
            </p>
            <textarea
              rows={3}
              value={rejectTransferReason}
              onChange={(e) => setRejectTransferReason(e.target.value)}
              placeholder="e.g. Funds not received in AMFFL corporate account; invalid session reference ID."
              required
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setRejectTransferModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectTransfer}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
