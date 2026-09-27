import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Shield, Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/seedData';
import { AMFFLLogo } from '../components/common/AMFFLLogo';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      navigate(returnTo);
    } catch (err: any) {
      setErrorMsg('Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    navigate(returnTo);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <AMFFLLogo variant="dark" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Sign In to AMFFL Hub
          </h1>
          <p className="text-xs text-slate-500">
            Access your classifieds dashboard, posting quotas and promotions
          </p>
        </div>

        {/* 1-Click Sandbox Persona Switcher */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block text-center">
            ⚡ Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleQuickDemoLogin(demo.id)}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all text-xs"
              >
                <div className="flex items-center gap-1 font-bold text-slate-900 truncate">
                  {demo.role === 'admin' ? (
                    <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                  ) : demo.tier_badge?.includes('Enterprise') ? (
                    <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : (
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{demo.full_name.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  {demo.role === 'admin' ? 'Global Admin' : demo.tier_badge || 'Buyer'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. emeka.auto@amffl.ng"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
