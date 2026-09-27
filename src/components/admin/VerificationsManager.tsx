import React, { useState } from 'react';
import { ShieldCheck, Check, X, Eye, FileText, UserCheck } from 'lucide-react';
import { SellerVerification } from '../../types';
import { StorageService } from '../../services/storageService';

export const VerificationsManager: React.FC = () => {
  const [verifications, setVerifications] = useState<SellerVerification[]>(() =>
    StorageService.getVerifications()
  );
  const [selectedVer, setSelectedVer] = useState<SellerVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const refresh = () => setVerifications(StorageService.getVerifications());

  const handleApprove = (ver: SellerVerification) => {
    ver.status = 'approved';
    ver.reviewed_at = new Date().toISOString();
    ver.reviewer_id = 'user-admin';
    StorageService.saveVerification(ver);

    // Update user record
    const user = StorageService.getUserById(ver.user_id);
    if (user) {
      user.is_verified = true;
      StorageService.saveUser(user);
    }

    refresh();
    setSelectedVer(null);
  };

  const handleReject = (ver: SellerVerification) => {
    ver.status = 'rejected';
    ver.rejection_reason = rejectionReason || 'Information could not be verified against official databases.';
    ver.reviewed_at = new Date().toISOString();
    ver.reviewer_id = 'user-admin';
    StorageService.saveVerification(ver);

    const user = StorageService.getUserById(ver.user_id);
    if (user) {
      user.is_verified = false;
      StorageService.saveUser(user);
    }

    refresh();
    setSelectedVer(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
            Seller Verifications Queue ({verifications.length})
          </h3>
          <p className="text-xs text-slate-500">Inspect submitted NIN, BVN or official CAC documents</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Seller Name / Email</th>
              <th className="py-2.5 px-3">Method</th>
              <th className="py-2.5 px-3">Submitted Value / Docs</th>
              <th className="py-2.5 px-3">Submitted At</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {verifications.map((ver) => (
              <tr key={ver.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-3">
                  <span className="font-bold text-slate-900 block">{ver.user_name || ver.user_id}</span>
                  <span className="text-[10px] text-slate-400">{ver.user_email}</span>
                </td>
                <td className="py-3 px-3 uppercase font-extrabold text-slate-700">
                  {ver.method}
                </td>
                <td className="py-3 px-3 font-mono">
                  {ver.value ? (
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {ver.value.slice(0, 4)}****{ver.value.slice(-3)}
                    </span>
                  ) : ver.document_files && ver.document_files.length > 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {ver.document_files.length} document file(s)
                    </span>
                  ) : (
                    'None'
                  )}
                </td>
                <td className="py-3 px-3 text-slate-500 text-[11px]">
                  {new Date(ver.submitted_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ver.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ver.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ver.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedVer(ver)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    title="Review Verification"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  {ver.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(ver)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      title="Approve & Grant Verified Badge"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {ver.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => setSelectedVer(ver)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      title="Reject"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      {selectedVer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Review Verification: {selectedVer.user_name}
            </h4>

            <div className="space-y-2 text-xs">
              <p><strong>Method:</strong> {selectedVer.method.toUpperCase()}</p>
              {selectedVer.value && <p><strong>Submitted Number:</strong> {selectedVer.value}</p>}
              {selectedVer.document_files && (
                <div>
                  <strong>Documents:</strong>
                  <ul className="list-disc pl-5 mt-1 text-emerald-700">
                    {selectedVer.document_files.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Rejection Reason (if rejecting):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the identity document was declined..."
                rows={2}
                className="w-full text-xs p-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedVer(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedVer)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Reject Verification
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedVer)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Approve &amp; Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
