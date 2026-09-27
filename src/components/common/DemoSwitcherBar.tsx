import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../data/seedData';
import { StorageService } from '../../services/storageService';
import { Shield, Sparkles, User, RefreshCw, LogOut } from 'lucide-react';

export const DemoSwitcherBar: React.FC = () => {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
            Demo Sandbox
          </span>
          <span className="text-slate-400">
            Active Persona:{' '}
            <strong className="text-white">
              {user ? `${user.full_name} (${user.role === 'admin' ? 'Admin' : user.tier_badge || 'Seller'})` : 'Guest / Browsing'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Quick Switch:</span>

          {DEMO_USERS.map((demo) => {
            const isCurrent = user?.id === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => switchDemoUser(demo.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={`Switch to ${demo.full_name} (${demo.role})`}
              >
                {demo.role === 'admin' ? (
                  <Shield className="w-3 h-3 text-amber-400" />
                ) : demo.tier_badge?.includes('Enterprise') ? (
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                ) : (
                  <User className="w-3 h-3 text-slate-400" />
                )}
                {demo.full_name.split(' ')[0]} ({demo.role === 'admin' ? 'Admin' : demo.tier_badge?.split(' ')[0]})
              </button>
            );
          })}

          <button
            onClick={() => switchDemoUser(null)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              !user ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Log out and view as guest"
          >
            <LogOut className="w-3 h-3" /> Guest
          </button>

          <div className="h-3 w-px bg-slate-700 mx-1" />

          <button
            onClick={() => {
              if (window.confirm('Reset all AMFFL demo data (listings, plans, verifications, wallet) to initial seed?')) {
                StorageService.resetToDefaults();
              }
            }}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] hover:underline"
            title="Restore original seed database"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" /> Reset DB
          </button>
        </div>
      </div>
    </div>
  );
};
