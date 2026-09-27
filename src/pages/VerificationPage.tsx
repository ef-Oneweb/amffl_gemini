import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Upload,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { SellerVerification, VerificationMethod } from '../types';

export const VerificationPage: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [existingVer, setExistingVer] = useState<SellerVerification | undefined>(undefined);
  const [method, setMethod] = useState<VerificationMethod>('nin');
  const [identityValue, setIdentityValue] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadVerification = () => {
    if (!user) return;
    const found = StorageService.getVerifications().find(v => v.user_id === user.id);
    setExistingVer(found);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?returnTo=/verify');
      return;
    }
    loadVerification();

    const handleUpdate = () => loadVerification();
    window.addEventListener('amffl_store_update', handleUpdate);
    return () => window.removeEventListener('amffl_store_update', handleUpdate);
  }, [user, isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');

    // Spec §7 auto-check validation: NIN and BVN must be 11 numeric digits
    if (method === 'nin' || method === 'bvn') {
      const cleanDigits = identityValue.replace(/\D/g, '');
      if (cleanDigits.length !== 11) {
        setErrorMsg(`Official ${method.toUpperCase()} must be exactly 11 digits.`);
        return;
      }
    } else if (method === 'document' && !docFileName) {
      setErrorMsg('Please select or specify a government-issued document.');
      return;
    }

    setSubmitting(true);

    const newVer: SellerVerification = {
      id: `ver_${Date.now()}`,
      user_id: user.id,
      user_name: user.full_name,
      user_email: user.email,
      method,
      value: method !== 'document' ? identityValue.replace(/\D/g, '') : undefined,
      document_files: method === 'document' ? [docFileName || 'CAC_Certificate_Incorporation.pdf'] : undefined,
      status: 'submitted',
      auto_check: true,
      submitted_at: new Date().toISOString(),
      notes: 'Submitted via verification center.',
    };

    StorageService.saveVerification(newVer);
    setExistingVer(newVer);
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          AMFFL Seller Verification Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verify your identity with your National Identification Number (NIN), BVN, or Corporate CAC documents to receive the Verified Merchant Badge and +25 search ranking bonus.
        </p>
      </div>

      {/* Current Status Tracker Banner */}
      {existingVer && (
        <div
          className={`p-6 rounded-3xl border shadow-sm flex items-start gap-4 ${
            existingVer.status === 'approved'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : existingVer.status === 'rejected'
              ? 'bg-red-50 border-red-200 text-red-950'
              : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}
        >
          {existingVer.status === 'approved' ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
          ) : existingVer.status === 'rejected' ? (
            <ShieldAlert className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <Clock className="w-7 h-7 text-blue-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm font-['Plus_Jakarta_Sans']">
                Verification Status:{' '}
                <span className="uppercase tracking-wider">{existingVer.status}</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                Submitted {new Date(existingVer.submitted_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {existingVer.status === 'approved' &&
                'Your account is officially verified! The Verified Merchant Badge is active on all your listings and public seller profile.'}
              {existingVer.status === 'submitted' &&
                'Your details are currently being cross-referenced with NIMC/CBN records. Approvals typically take 15–30 minutes.'}
              {existingVer.status === 'rejected' &&
                `Your verification was declined: ${existingVer.rejection_reason || 'Document mismatch'}. You can re-submit valid credentials below.`}
            </p>
          </div>
        </div>
      )}

      {/* Verification Submission Form */}
      {(!existingVer || existingVer.status === 'rejected') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Select Verification Method
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose your preferred form of legal identification</p>
          </div>

          {/* Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => { setMethod('nin'); setErrorMsg(''); }}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                method === 'nin'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs block font-bold">NIN</span>
              <span className="text-[10px] text-slate-400">11-digit Identity</span>
            </button>

            <button
              type="button"
              onClick={() => { setMethod('bvn'); setErrorMsg(''); }}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                method === 'bvn'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs block font-bold">BVN</span>
              <span className="text-[10px] text-slate-400">Bank Verification</span>
            </button>

            <button
              type="button"
              onClick={() => { setMethod('document'); setErrorMsg(''); }}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                method === 'document'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span className="text-xs block font-bold">CAC / Passport</span>
              <span className="text-[10px] text-slate-400">Official Document</span>
            </button>
          </div>

          {/* Form Fields */}
          {method !== 'document' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Enter Your 11-Digit {method.toUpperCase()} Number
              </label>
              <input
                type="text"
                maxLength={11}
                required
                value={identityValue}
                onChange={(e) => setIdentityValue(e.target.value)}
                placeholder={method === 'nin' ? 'e.g. 29384756102' : 'e.g. 22119933445'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Your identification number is encrypted and securely checked with federal registries.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Upload Corporate / ID Document
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
                <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {docFileName || 'Select CAC certificate, Voter card or National Passport'}
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDocFileName('CAC_Certificate_Registration_BN20948.pdf')}
                    className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:border-emerald-600"
                  >
                    + Use Sample CAC PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-xs text-red-700 flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link to="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Return to Dashboard
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Verifying...' : 'Submit Verification'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
