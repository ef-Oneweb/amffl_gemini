import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  X,
  Code2
} from 'lucide-react';
import { AuditLog } from '../../types';
import { StorageService } from '../../services/storageService';

export const AdminAuditLogsDesk: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'all') {
      if (!log.action.startsWith(actionFilter)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor_name?.toLowerCase().includes(q) || log.actor_id.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchTarget = log.target_id.toLowerCase().includes(q) || log.target_type.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchTarget) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Actor ID', 'Actor Name', 'Action', 'Target Type', 'Target ID', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.actor_id,
      `"${l.actor_name || ''}"`,
      l.action,
      l.target_type,
      l.target_id,
      `"${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amffl_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <History className="w-6 h-6 text-slate-800" />
              Immutable Audit &amp; Governance Trail
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Append-Only WORM Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete cryptographic audit log of all administrative actions, listing approvals, membership overrides, KYC verifications, and financial transactions.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV ({filteredLogs.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Action Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'listing', label: 'Listings' },
            { id: 'user', label: 'Users' },
            { id: 'payment', label: 'Finance' },
            { id: 'verification', label: 'KYC' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                actionFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, target ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Target ID</th>
                <th className="py-3 px-4 text-right">Inspect Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-NG', {
                        dateStyle: 'short',
                        timeStyle: 'medium'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{log.actor_name || 'System Auto'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.actor_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono ${
                        log.action.includes('delete') || log.action.includes('reject') || log.action.includes('suspend')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : log.action.includes('approve') || log.action.includes('create')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-slate-500">
                      {log.target_type}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">
                      {log.target_id}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Payload
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Audit Event Details ({selectedLog.action})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Actor</span>
                <p className="font-bold text-slate-900">{selectedLog.actor_name}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Event ID</span>
                <p className="font-mono text-slate-900">{selectedLog.id}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Target Entity</span>
                <p className="font-bold text-slate-900">{selectedLog.target_type}: {selectedLog.target_id}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Timestamp</span>
                <p className="font-mono text-slate-900">{new Date(selectedLog.timestamp).toISOString()}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                JSON Event Payload
              </span>
              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
