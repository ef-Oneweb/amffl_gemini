import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Eye, 
  FileText, 
  UserCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Award, 
  Building2, 
  CreditCard,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { SellerVerification, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminVerificationsDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [verifications, setVerifications] = useState<SellerVerification[]>(() =>
    StorageService.getVerifications()
  );
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVer, setSelectedVer] = useState<SellerVerification | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('ID Verified');
  const [staffNote, setStaffNote] = useState('');

  const refresh = () => setVerifications(StorageService.getVerifications());

  const canModerate = canPerform('approve_verifications');

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

  const filteredVerifications = verifications.filter(v => {
    if (filterTab !== 'all' && v.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.user_name?.toLowerCase().includes(q);
      const matchEmail = v.user_email?.toLowerCase().includes(q);
      const matchMethod = v.method.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchMethod) return false;
    }
    return true;
  });

  const handleApprove = (ver: SellerVerification) => {
    if (!canModerate) {
      alert('Your admin role does not have permission to approve verifications.');
      return;
    }

    const updatedVer: SellerVerification = {
      ...ver,
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewer_id: 'admin_tunde',
      rejection_reason: undefined
    };

    StorageService.saveVerification(updatedVer);

    // Update user record & badge
    const user = StorageService.getUserById(ver.user_id);
    if (user) {
      const updatedBadges = Array.from(new Set([...(user.badges || []), selectedBadge || 'ID Verified']));
      const updatedUser: User = {
        ...user,
        is_verified: true,
        badges: updatedBadges
      };
      StorageService.saveUser(updatedUser);
    }

    StorageService.logAuditEvent({
      action: 'verification_approve',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'verification',
      target_id: ver.id,
      details: {
        seller_id: ver.user_id,
        seller_name: ver.user_name,
        method: ver.method,
        badge_granted: selectedBadge,
        staff_note: staffNote
      }
    });

    refresh();
    setSelectedVer(null);
    setStaffNote('');
  };

  const handleReject = () => {
    if (!selectedVer || !canModerate) return;
    const finalReason = customReason.trim() || selectedReason || 'Submitted credentials failed verification guidelines.';

    const updatedVer: SellerVerification = {
      ...selectedVer,
      status: 'rejected',
      rejection_reason: finalReason,
      reviewed_at: new Date().toISOString(),
      reviewer_id: 'admin_tunde'
    };

    StorageService.saveVerification(updatedVer);

    // Revoke user verification status
    const user = StorageService.getUserById(selectedVer.user_id);
    if (user) {
      const updatedUser: User = {
        ...user,
        is_verified: false
      };
      StorageService.saveUser(updatedUser);
    }

    StorageService.logAuditEvent({
      action: 'verification_reject',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'verification',
      target_id: selectedVer.id,
      details: {
        seller_id: selectedVer.user_id,
        seller_name: selectedVer.user_name,
        method: selectedVer.method,
        rejection_reason: finalReason
      }
    });

    refresh();
    setRejectionModalOpen(false);
    setSelectedVer(null);
    setSelectedReason('');
    setCustomReason('');
  };

  const standardRejectionReasons = [
    'NIN / BVN details mismatch with registered AMFFL seller profile',
    'Submitted document image is unreadable, blurred, or cropped',
    'Corporate Affairs Commission (CAC) registration certificate could not be confirmed',
    'Uploaded government ID is expired or invalid',
    'Suspected fraudulent or duplicate KYC documentation',
    'Proof of business address / utility bill not matching company name'
  ];

  return (
    <div className="space-y-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Seller Identity &amp; Verification Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative KYC review for Nigerian National ID (NIN), BVN, CAC Business Certificates &amp; Merchant Trust Badges.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{pendingCount}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Review</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{approvedCount}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Approved Badges</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{rejectedCount}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Rejected / Revisions</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{verifications.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Total Submissions</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          {[
            { id: 'all', label: 'All Submissions', count: verifications.length },
            { id: 'pending', label: 'Pending Review', count: pendingCount },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterTab === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search seller name, email, method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>
      </div>

      {/* Verifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Seller Identity</th>
                <th className="py-3 px-4">KYC Method</th>
                <th className="py-3 px-4">Credential / Document</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No verification records found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredVerifications.map((ver) => {
                  const user = StorageService.getUserById(ver.user_id);
                  return (
                    <tr key={ver.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ver.user_name || 'Anonymous User'}</div>
                        <div className="text-[11px] text-slate-500">{ver.user_email}</div>
                        {user?.phone && (
                          <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          ver.method === 'nin'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : ver.method === 'bvn'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : ver.method === 'cac'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {ver.method === 'cac' && <Building2 className="w-3 h-3" />}
                          {ver.method === 'bvn' && <CreditCard className="w-3 h-3" />}
                          {ver.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {ver.value ? (
                          <div className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] inline-block">
                            {ver.value.slice(0, 4)}••••{ver.value.slice(-3)}
                          </div>
                        ) : ver.document_files && ver.document_files.length > 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> {ver.document_files.length} Document Upload(s)
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No direct file upload</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {new Date(ver.submitted_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        {ver.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {ver.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                        {ver.status === 'rejected' && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                            {ver.rejection_reason && (
                              <p className="text-[10px] text-rose-600 mt-1 max-w-xs truncate" title={ver.rejection_reason}>
                                {ver.rejection_reason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVer(ver)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </button>
                          {ver.status === 'pending' && canModerate && (
                            <>
                              <button
                                onClick={() => handleApprove(ver)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                                title="Approve Verification"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedVer(ver);
                                  setRejectionModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                title="Reject with Reason"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Inspection Modal */}
      {selectedVer && !rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                    Inspect KYC Dossier: {selectedVer.user_name}
                  </h3>
                  <p className="text-xs text-slate-500">Submission ID: {selectedVer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Seller profile info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
                <p className="text-xs font-bold text-slate-900">{selectedVer.user_name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Account Email</span>
                <p className="text-xs font-bold text-slate-900">{selectedVer.user_email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Category</span>
                <p className="text-xs font-bold text-slate-900 uppercase">{selectedVer.method}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Submission Timestamp</span>
                <p className="text-xs font-bold text-slate-900">{new Date(selectedVer.submitted_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Submitted Document details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                Submitted Documentation
              </h4>
              {selectedVer.value && (
                <div className="bg-slate-900 text-white p-3.5 rounded-xl font-mono text-sm flex items-center justify-between">
                  <span>Credential Value: {selectedVer.value}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
                    Encrypted Format
                  </span>
                </div>
              )}

              {selectedVer.document_files && selectedVer.document_files.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedVer.document_files.map((file, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{file}</span>
                      </div>
                      <a 
                        href={`https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Doc
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  Verification conducted via automated biometric/registry lookup (NIN / BVN direct lookup).
                </p>
              )}
            </div>

            {/* Badge Assignment */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Assign Verified Merchant Badge
              </label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ID Verified">ID Verified (NIN / Passport confirmed)</option>
                <option value="Business Verified">Business Verified (CAC Registered)</option>
                <option value="Agricultural Co-op">Agricultural Co-op / Farmers Union</option>
                <option value="Registered Dealer">Registered Auto/Equipment Dealer</option>
                <option value="Premium Seller">Premium Verified Seller</option>
                <option value="Tier 1 Verified Seller">Tier 1 Nigerian Verified Merchant</option>
              </select>
            </div>

            {/* Staff Internal Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Staff Inspection Notes (Internal Audit Log)
              </label>
              <textarea
                rows={2}
                placeholder="E.g., NIN confirmed on NIMC verification terminal. CAC RC number 148920 confirmed active on portal."
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedVer(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>

              {canModerate && selectedVer.status !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject Submission
                </button>
              )}

              {canModerate && selectedVer.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedVer)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
                >
                  <Check className="w-4 h-4" /> Approve &amp; Assign Badge
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && selectedVer && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                  Reject Verification Request
                </h3>
                <p className="text-xs text-slate-500">Provide an authoritative reason for seller notification</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Select Pre-defined Reason
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {standardRejectionReasons.map((reason, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-rose-400 bg-rose-50/50 text-rose-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionReason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Or Enter Custom Feedback
              </label>
              <textarea
                rows={2}
                placeholder="Specific guidance for the seller..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!selectedReason && !customReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
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
