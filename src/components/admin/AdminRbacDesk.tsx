import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Check, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminRbacDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => StorageService.getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for new/editing admin user
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Partial<AdminUser> | null>(null);

  const refresh = () => setAdminUsers(StorageService.getAdminUsers());
  const canManageAdmins = canPerform('manage_admins');

  const filteredAdmins = adminUsers.filter(u => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = u.full_name || u.name || '';
      return name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminName = editingAdmin?.full_name || editingAdmin?.name;
    if (!editingAdmin || !adminName || !editingAdmin.email || !canManageAdmins) return;

    const userToSave: AdminUser = {
      id: editingAdmin.id || `admin_${Date.now()}`,
      name: adminName,
      full_name: adminName,
      email: editingAdmin.email,
      role: editingAdmin.role || 'read_only_admin',
      status: (editingAdmin.is_active ?? true) ? 'active' : 'inactive',
      is_active: editingAdmin.is_active !== undefined ? editingAdmin.is_active : true,
      last_active_at: editingAdmin.last_active_at || new Date().toISOString(),
      created_at: editingAdmin.created_at || new Date().toISOString()
    };

    StorageService.saveAdminUser(userToSave);
    StorageService.logAuditEvent({
      action: 'admin_create',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'admin_user',
      target_id: userToSave.id,
      details: { name: userToSave.full_name, role: userToSave.role }
    });

    setUserModalOpen(false);
    setEditingAdmin(null);
    refresh();
  };

  const roleDefinitions: { role: AdminRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Root access across all settings, users, finance, and system operations.' },
    { role: 'marketplace_manager', label: 'Marketplace Manager', desc: 'Full authority over categories, attributes, listings, plans, and promotions.' },
    { role: 'listing_moderator', label: 'Listing Moderator', desc: 'Inspects and approves/rejects classifieds, manages reports & reviews.' },
    { role: 'user_manager', label: 'User Manager', desc: 'Suspends, restores, and manages merchant memberships & account profiles.' },
    { role: 'finance_admin', label: 'Finance Admin', desc: 'Reconciles bank transfers, approves refunds, and inspects revenue ledgers.' },
    { role: 'verification_officer', label: 'Verification Officer', desc: 'Reviews KYC documents (NIN, BVN, CAC) and awards verified merchant badges.' },
    { role: 'communications_admin', label: 'Communications Admin', desc: 'Controls promotional banners, broadcast announcements, and notification templates.' },
    { role: 'support_lead', label: 'Support Lead', desc: 'Resolves member support tickets, answers inquiries, and logs staff memos.' },
    { role: 'content_editor', label: 'Content Editor', desc: 'Authors and updates static CMS policy pages, safety guides, and handbook.' },
    { role: 'auditor', label: 'Compliance Auditor', desc: 'Read-only access to immutable audit trails, finance logs, and system metrics.' },
    { role: 'read_only_admin', label: 'Read-Only Admin', desc: 'Inspect-only access across all desks without write or mutate privileges.' }
  ];

  const permissionsList = [
    { id: 'edit_listings', label: 'Edit & Publish Listings' },
    { id: 'moderate_listings', label: 'Approve / Reject Listings' },
    { id: 'manage_categories', label: 'Categories & Attributes' },
    { id: 'manage_memberships', label: 'Plans & Subscription Quotas' },
    { id: 'manage_users', label: 'User Profiles & Suspension' },
    { id: 'verify_payments', label: 'Reconcile Bank Transfers' },
    { id: 'manage_refunds', label: 'Authorize Paystack Refunds' },
    { id: 'approve_verifications', label: 'Approve KYC / Assign Badges' },
    { id: 'manage_cms', label: 'Banners, Broadcasts & CMS' },
    { id: 'manage_support', label: 'Customer Support Tickets' },
    { id: 'manage_settings', label: 'Ranking Weights & Rules' },
    { id: 'manage_admins', label: 'Invite Admins & Assign RBAC' },
    { id: 'export_data', label: 'Export System Data (CSV)' },
    { id: 'view_audit_logs', label: 'Inspect Immutable Audit Logs' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Key className="w-6 h-6 text-purple-600" />
            Role-Based Access Control (RBAC) &amp; Staff Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative administration of internal staff credentials, 11 discrete operational roles, and granular permission enforcement.
          </p>
        </div>

        {canManageAdmins && (
          <button
            onClick={() => {
              setEditingAdmin({
                full_name: '',
                email: '',
                role: 'listing_moderator',
                is_active: true
              });
              setUserModalOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Admin User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Staff Directory ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Permissions Matrix (11 Roles)</span>
        </button>
      </div>

      {/* TAB 1: ADMIN USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Internal AMFFL Operations Personnel ({adminUsers.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.full_name || user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        (user.is_active ?? (user.status === 'active')) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {(user.is_active ?? (user.status === 'active')) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {(user.is_active ?? (user.status === 'active')) ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(user.last_active_at || user.last_login || user.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canManageAdmins && (
                        <button
                          onClick={() => {
                            setEditingAdmin(user);
                            setUserModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Authoritative 11-Role Access Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforced by StorageService.canPerformPermission across every write and mutate API.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase text-[9px]">
                  <th className="py-3 px-3 min-w-[180px]">Operational Capability</th>
                  {roleDefinitions.map(r => (
                    <th key={r.role} className="py-3 px-2 text-center truncate max-w-[90px]" title={r.label}>
                      {r.label.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsList.map(perm => (
                  <tr key={perm.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800 text-xs">{perm.label}</td>
                    {roleDefinitions.map(r => {
                      const hasPerm = StorageService.canPerformPermission(r.role, perm.id);
                      return (
                        <td key={r.role} className="py-2.5 px-2 text-center">
                          {hasPerm ? (
                            <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex w-5 h-5 rounded-full bg-slate-100 text-slate-300 items-center justify-center">
                              -
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveAdmin} className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              {editingAdmin?.id ? 'Edit Staff Credentials' : 'Add New Admin Staff'}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                required
                value={editingAdmin?.full_name || ''}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                placeholder="e.g. Babatunde Balogun"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Staff Email</label>
              <input
                type="email"
                required
                value={editingAdmin?.email || ''}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                placeholder="babatunde@amffl.org.ng"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Assigned Role</label>
              <select
                value={editingAdmin?.role || 'listing_moderator'}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminRole })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {roleDefinitions.map(r => (
                  <option key={r.role} value={r.role}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activeStatus"
                checked={editingAdmin?.is_active ?? true}
                onChange={(e) => setEditingAdmin({ ...editingAdmin, is_active: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="activeStatus" className="text-xs font-bold text-slate-700 cursor-pointer">
                Account Active &amp; Login Enabled
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
              >
                Save Staff Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
