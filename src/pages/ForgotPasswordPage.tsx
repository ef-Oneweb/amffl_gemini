import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AMFFLLogo } from '../components/common/AMFFLLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <AMFFLLogo variant="dark" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500">
            Enter your email to receive password recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">Recovery Link Dispatched</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              If an AMFFL account exists for <strong className="text-slate-800">{email}</strong>, you will receive a secure reset link shortly.
            </p>
            <div className="pt-2">
              <Link
                to="/reset-password?token=demo_token_12345"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                (Demo: Click here to proceed to Reset Screen)
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
