import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const SeedManager: React.FC = () => {
  const [seedKey, setSeedKey] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSeedAll = () => {
    StorageService.resetToDefaults();
    setStatusMsg('Database successfully re-seeded with initial catalog, plans and listings.');
  };

  const handleGatedSeed = () => {
    if (seedKey !== 'AMFFL_SEED_2026') {
      alert('Invalid seed key. Required key: AMFFL_SEED_2026');
      return;
    }
    StorageService.resetToDefaults();
    setStatusMsg('Gated membership catalog seed executed successfully with key AMFFL_SEED_2026.');
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
          Catalog &amp; Membership Seed Operations
        </h3>
        <p className="text-xs text-slate-500">
          Restore initial verified listings, membership plans, promotions and Nigerian taxonomy
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Reset Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-xs text-slate-900">One-Click Default Restore</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Resets all listings, plans, reviews and verifications to the benchmark demo state.
          </p>
          <button
            type="button"
            onClick={handleSeedAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Reset to Default Seed
          </button>
        </div>

        {/* Gated Seed from Spec (§7 / §8: seedMembership requires seed_key==="AMFFL_SEED_2026") */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-xs text-slate-900">Key-Gated Production Seed</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Executes idempotent seed using the spec key (<code className="font-mono text-purple-700">AMFFL_SEED_2026</code>).
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={seedKey}
              onChange={(e) => setSeedKey(e.target.value)}
              placeholder="Enter AMFFL_SEED_2026"
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono"
            />
            <button
              type="button"
              onClick={handleGatedSeed}
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Seed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
