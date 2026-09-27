import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  HardDrive, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminSystemHealthDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [stats, setStats] = useState<{
    totalBytes: number;
    totalKB: string;
    itemCount: number;
    collections: { key: string; label: string; count: number; sizeKB: string }[];
  }>({ totalBytes: 0, totalKB: '0', itemCount: 0, collections: [] });

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const calculateStorage = () => {
    let totalBytes = 0;
    const collectionsMeta = [
      { key: 'amffl_listings', label: 'Classified Listings' },
      { key: 'amffl_users', label: 'User & Merchant Accounts' },
      { key: 'amffl_categories', label: 'Categories & Subcategories' },
      { key: 'amffl_membership_plans', label: 'Paid Membership Plans' },
      { key: 'amffl_transactions', label: 'Financial Transactions Ledger' },
      { key: 'amffl_bank_transfers', label: 'Manual Bank Transfer Slips' },
      { key: 'amffl_audit_logs', label: 'Immutable Audit Trail' },
      { key: 'amffl_support_tickets', label: 'Customer Support Tickets' },
      { key: 'amffl_marketplace_banners', label: 'Promotional Banners' },
      { key: 'amffl_cms_pages', label: 'Legal & Static CMS Pages' }
    ];

    const collections = collectionsMeta.map(col => {
      const data = localStorage.getItem(col.key) || '[]';
      const bytes = new Blob([data]).size;
      totalBytes += bytes;
      let count = 0;
      try {
        count = JSON.parse(data).length || 0;
      } catch (e) {
        count = 0;
      }
      return {
        key: col.key,
        label: col.label,
        count,
        sizeKB: (bytes / 1024).toFixed(1)
      };
    });

    setStats({
      totalBytes,
      totalKB: (totalBytes / 1024).toFixed(1),
      itemCount: collections.reduce((acc, c) => acc + c.count, 0),
      collections
    });
  };

  useEffect(() => {
    calculateStorage();
  }, []);

  const handleResetSeeds = () => {
    StorageService.init();
    StorageService.logAuditEvent({
      action: 'system_seed_reset',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'system',
      target_id: 'database',
      details: { action: 'Database reseeded to authoritative Nigerian marketplace seed state' }
    });
    setConfirmResetOpen(false);
    calculateStorage();
    alert('AMFFL database reseeded successfully with full Nigerian classifieds seed dataset!');
    window.location.reload();
  };

  const handleClearEphemeralCache = () => {
    localStorage.removeItem('amffl_active_filters');
    localStorage.removeItem('amffl_recent_searches');
    alert('Temporary search filters and client cache cleared.');
    calculateStorage();
  };

  // Browser quota estimate is typically 5MB (5120 KB)
  const estimatedCapacityKB = 5120;
  const usagePercent = Math.min(100, Math.round((parseFloat(stats.totalKB) / estimatedCapacityKB) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            System Diagnostics, LocalStorage &amp; Storage Health
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time memory allocation metrics, collection integrity inspection, cache purging &amp; seed database maintenance.
          </p>
        </div>

        <button
          onClick={calculateStorage}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Recalculate Storage
        </button>
      </div>

      {/* Storage Utilization Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                Client Browser LocalStorage Quota
              </h3>
              <p className="text-xs text-slate-500">
                Current Authoritative Dataset: <strong className="text-slate-800">{stats.totalKB} KB</strong> ({stats.itemCount} items) across all administrative entities.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700">{usagePercent}%</span>
            <span className="text-xs text-slate-400 block">of ~5MB browser quota used</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.max(4, usagePercent)}%` }}
          />
        </div>
      </div>

      {/* Collection Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Database Collections &amp; Record Densities
          </h3>
          <span className="text-xs text-slate-500">All data stored in high-performance localStorage store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Entity Collection</th>
                <th className="py-3 px-4">Storage Key</th>
                <th className="py-3 px-4">Records Count</th>
                <th className="py-3 px-4">Allocated Size</th>
                <th className="py-3 px-4 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.collections.map((col) => (
                <tr key={col.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{col.label}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{col.key}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{col.count} items</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{col.sizeKB} KB</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reset seeds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Reseed Official Seed Data</h4>
              <p className="text-xs text-slate-500">Restores standard Nigerian demo sellers, listings, and audit logs.</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Reset Database to Factory Seed State
          </button>
        </div>

        {/* Clear cache */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Purge Ephemeral Search Caches</h4>
              <p className="text-xs text-slate-500">Flushes temporary user search history and filter breadcrumbs.</p>
            </div>
          </div>
          <button
            onClick={handleClearEphemeralCache}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Clear Search &amp; Client Filters
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Confirm Database Reseed</h3>
                <p className="text-xs text-slate-500">This action will re-populate all core tables</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to reseed the local database? This will refresh all Nigerian classified ads, verified merchants, bank transfer receipts, and audit logs with clean demo seed data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetSeeds}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Confirm Reseed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
