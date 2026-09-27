import React, { useState } from 'react';
import { X, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Listing, ReportReason, ListingReport } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, listing }) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<ReportReason>('scam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const report: ListingReport = {
      id: `rep_${Date.now()}`,
      reporter_id: user?.id || 'guest_reporter',
      reporter_name: user?.full_name || 'Anonymous User',
      listing_id: listing.id,
      listing_title: listing.title,
      reason,
      details: details.trim(),
      status: 'open',
      created_date: new Date().toISOString(),
    };

    StorageService.saveReport(report);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 bg-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-300" />
            <h3 className="font-extrabold text-sm font-['Plus_Jakarta_Sans']">Report this Listing</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="font-bold text-slate-900 text-sm">Report Submitted</p>
              <p className="text-xs text-slate-500">
                Our trust &amp; safety team will investigate this listing immediately.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Reporting
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="scam">Fraud / Scam / Suspicious Seller</option>
                  <option value="duplicate">Duplicate Listing</option>
                  <option value="wrong_category">Wrong Category</option>
                  <option value="inappropriate">Inappropriate or Prohibited Goods</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Provide Specific Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain why this listing violates AMFFL safety standards..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
