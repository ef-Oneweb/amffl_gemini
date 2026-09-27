import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  FileText, 
  Users, 
  Tag, 
  CreditCard, 
  History, 
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ListingsImportManager } from './ListingsImportManager';

export const AdminExportCenterDesk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [lastExported, setLastExported] = useState<string | null>(null);

  const exportCsv = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLastExported(filename);

    StorageService.logAuditEvent({
      action: 'export_data',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'export',
      target_id: filename,
      details: { record_count: rows.length }
    });
  };

  const handleExportListings = () => {
    const listings = StorageService.getListings();
    const headers = ['ID', 'Title', 'Price (NGN)', 'Negotiable', 'Category', 'Seller ID', 'Seller Name', 'State', 'LGA', 'Status', 'Featured', 'Created Date'];
    const rows = listings.map(l => [
      l.id,
      `"${l.title.replace(/"/g, '""')}"`,
      l.price,
      l.negotiable,
      l.category_slug,
      l.user_id,
      `"${(l.seller_name || '').replace(/"/g, '""')}"`,
      `"${l.location_state}"`,
      `"${l.location_lga}"`,
      l.status,
      l.is_featured,
      `"${l.created_date}"`
    ]);
    exportCsv('amffl_classified_listings', headers, rows);
  };

  const handleExportUsers = () => {
    const users = StorageService.getUsers();
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Role', 'Status', 'Verified', 'Badges', 'Created Date'];
    const rows = users.map(u => [
      u.id,
      `"${u.full_name.replace(/"/g, '""')}"`,
      u.email,
      `"${u.phone || ''}"`,
      u.role,
      (u as any).account_status || u.status || 'active',
      u.is_verified,
      `"${(u.badges || []).join(', ')}"`,
      `"${u.created_date}"`
    ]);
    exportCsv('amffl_registered_users', headers, rows);
  };

  const handleExportSubscriptions = () => {
    const subs = StorageService.getSubscriptions();
    const headers = ['ID', 'User ID', 'Plan ID', 'Plan Name', 'Family', 'Price (NGN)', 'Status', 'Start Date', 'End Date'];
    const rows = subs.map(s => [
      s.id,
      s.user_id,
      s.plan_id,
      `"${s.plan_name}"`,
      s.family_slug || 'general',
      s.price,
      s.status,
      `"${s.start_date}"`,
      `"${s.expiry_date}"`
    ]);
    exportCsv('amffl_membership_subscriptions', headers, rows);
  };

  const handleExportTransactions = () => {
    const txs = StorageService.getTransactions();
    const headers = ['ID', 'User ID', 'Amount (NGN)', 'Purpose', 'Status', 'Paystack Reference', 'Paid At'];
    const rows = txs.map(t => [
      t.id,
      t.user_id,
      t.amount,
      t.purpose,
      t.status,
      `"${t.paystack_reference || ''}"`,
      `"${t.paid_at || ''}"`
    ]);
    exportCsv('amffl_financial_transactions', headers, rows);
  };

  const handleExportBankTransfers = () => {
    const transfers = StorageService.getBankTransfers();
    const headers = ['ID', 'User Name', 'Plan Name', 'Bank Name', 'Account Name', 'Amount (NGN)', 'Status', 'Created Date'];
    const rows = transfers.map(b => [
      b.id,
      `"${b.user_name}"`,
      `"${b.plan_or_package || (b as any).plan_name || ''}"`,
      `"${b.bank_name}"`,
      `"${b.sender_name || (b as any).sender_account_name || ''}"`,
      b.amount,
      b.status,
      `"${b.created_at}"`
    ]);
    exportCsv('amffl_bank_transfers', headers, rows);
  };

  const handleExportAuditLogs = () => {
    const logs = StorageService.getAuditLogs();
    const headers = ['ID', 'Timestamp', 'Actor ID', 'Actor Name', 'Action', 'Target Type', 'Target ID'];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      l.actor_id,
      `"${l.actor_name || ''}"`,
      l.action,
      l.target_type,
      l.target_id
    ]);
    exportCsv('amffl_audit_trail', headers, rows);
  };

  const exportDatasets = [
    {
      title: 'Classified Listings',
      desc: 'All marketplace ads including prices, categories, seller IDs, locations, and moderation statuses.',
      count: StorageService.getListings().length,
      icon: <Tag className="w-6 h-6 text-emerald-600" />,
      action: handleExportListings
    },
    {
      title: 'Registered Users & Merchants',
      desc: 'Seller profiles, phone numbers, KYC verification badges, and account standing.',
      count: StorageService.getUsers().length,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      action: handleExportUsers
    },
    {
      title: 'Membership Subscriptions',
      desc: 'Active and expired paid plan subscriptions, tier levels, start/end dates, and fees paid.',
      count: StorageService.getSubscriptions().length,
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      action: handleExportSubscriptions
    },
    {
      title: 'Revenue & Paystack Transactions',
      desc: 'Authoritative transaction ledger for card payments, wallet debits, and Paystack references.',
      count: StorageService.getTransactions().length,
      icon: <CreditCard className="w-6 h-6 text-teal-600" />,
      action: handleExportTransactions
    },
    {
      title: 'Manual Bank Transfer Slips',
      desc: 'Manual bank deposit audit records with sender account names, teller references, and verifications.',
      count: StorageService.getBankTransfers().length,
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      action: handleExportBankTransfers
    },
    {
      title: 'Governance Audit Logs',
      desc: 'Immutable append-only record of all administrative actions, logins, status updates, and deletions.',
      count: StorageService.getAuditLogs().length,
      icon: <History className="w-6 h-6 text-purple-600" />,
      action: handleExportAuditLogs
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            Data Export &amp; Bulk Migration Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative CSV data generator for financial auditing, marketplace analytics, regulatory reports &amp; bulk catalog imports.
          </p>
        </div>
      </div>

      {lastExported && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Successfully generated and downloaded <strong>{lastExported}.csv</strong></span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'export'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export Center (6 Datasets)</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'import'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Bulk CSV Catalog Import</span>
        </button>
      </div>

      {/* TAB 1: EXPORT CARDS */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exportDatasets.map((ds, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {ds.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">{ds.title}</h3>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    {ds.count.toLocaleString()} Records Available
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{ds.desc}</p>
              </div>

              <button
                onClick={ds.action}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BULK IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <ListingsImportManager />
        </div>
      )}
    </div>
  );
};
