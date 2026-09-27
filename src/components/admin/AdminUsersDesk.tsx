import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Search, 
  Edit3, 
  CheckCircle2, 
  X, 
  Tag, 
  Crown, 
  Receipt, 
  Clock, 
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  User, 
  Listing, 
  Subscription, 
  Transaction, 
  SellerVerification, 
  UserRole,
  UserAccountStatus 
} from '../../types';

interface AdminUsersDeskProps {
  users: User[];
  listings: Listing[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  verifications: SellerVerification[];
  onSaveUser: (user: User) => void;
  onSuspendUser: (id: string, reason: string) => void;
  onRestoreUser: (id: string) => void;
  onDeactivateUser: (id: string) => void;
  onVerifyUser: (id: string, method: string) => void;
  canPerform: (perm: string) => boolean;
}

export const AdminUsersDesk: React.FC<AdminUsersDeskProps> = ({
  users,
  listings,
  subscriptions,
  transactions,
  verifications,
  onSaveUser,
  onSuspendUser,
  onRestoreUser,
  onDeactivateUser,
  onVerifyUser,
  canPerform,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sellers' | 'buyers' | 'admins' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Drawer State
  const [drawerUser, setDrawerUser] = useState<User | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'listings' | 'membership' | 'payments' | 'verification'>('overview');

  // Create/Edit User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [tierBadge, setTierBadge] = useState('Standard');

  // Suspend Modal
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendingUserId, setSuspendingUserId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'sellers' && u.role !== 'user' && !u.company_name && !listings.some(l => l.user_id === u.id)) return false;
    if (activeTab === 'buyers' && (u.company_name || listings.some(l => l.user_id === u.id))) return false;
    if (activeTab === 'admins' && u.role !== 'admin') return false;
    if (activeTab === 'suspended' && u.status !== 'suspended') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.full_name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = (u.phone || '').includes(q);
      const matchComp = (u.company_name || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchComp) return false;
    }
    return true;
  });

  const handleOpenUserModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFullName(u.full_name);
      setEmail(u.email);
      setPhone(u.phone || '');
      setCompanyName(u.company_name || '');
      setRole(u.role);
      setTierBadge(u.tier_badge || 'Standard');
    } else {
      setEditingUser(null);
      setFullName('');
      setEmail('');
      setPhone('+234 ');
      setCompanyName('');
      setRole('user');
      setTierBadge('Standard');
    }
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const updated: User = {
      id: editingUser?.id || `user-${Date.now()}`,
      created_date: editingUser?.created_date || new Date().toISOString(),
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company_name: companyName.trim() || undefined,
      role,
      tier_badge: tierBadge,
      status: editingUser?.status || 'active',
      is_verified: editingUser?.is_verified ?? false,
      member_since: editingUser?.member_since || 'Active Member',
    };

    onSaveUser(updated);
    setUserModalOpen(false);
  };

  const handleConfirmSuspend = () => {
    if (!suspendingUserId || !suspendReason.trim()) return;
    onSuspendUser(suspendingUserId, suspendReason.trim());
    setSuspendModalOpen(false);
    setSuspendingUserId(null);
    if (drawerUser?.id === suspendingUserId) {
      setDrawerUser(prev => prev ? { ...prev, status: 'suspended', suspension_reason: suspendReason } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            User &amp; Seller Accounts Management
          </h2>
          <p className="text-xs text-slate-500">
            Control accounts, merchant verification status, privileges, and enforce suspensions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenUserModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add User / Seller</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sellers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sellers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sellers &amp; Merchants
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admins' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admins
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suspended')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'suspended' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Suspended ({users.filter(u => u.status === 'suspended').length})
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">User / Merchant</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Role &amp; Tier</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isSuspended = user.status === 'suspended';
                const userAdsCount = listings.filter(l => l.user_id === user.id).length;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* User */}
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => { setDrawerUser(user); setDrawerTab('overview'); }}
                        className="font-bold text-blue-700 hover:text-blue-900 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{user.full_name}</span>
                        {user.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.company_name ? `${user.company_name} • ` : ''}Member since {user.member_since || '2026'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3">
                      <div className="text-slate-700">{user.email}</div>
                      <div className="text-[10px] text-slate-400">{user.phone || 'No phone'}</div>
                    </td>

                    {/* Role & Tier */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 capitalize">{user.role}</span>
                      <div className="text-[10px] text-purple-700 font-bold">{user.tier_badge || 'Standard'} ({userAdsCount} ads)</div>
                    </td>

                    {/* Verification */}
                    <td className="py-3 px-3">
                      {user.is_verified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onVerifyUser(user.id, 'nin')}
                          className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 underline"
                        >
                          + Verify User
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isSuspended ? 'bg-red-100 text-red-800' :
                        user.status === 'deactivated' ? 'bg-slate-200 text-slate-700' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => { setDrawerUser(user); setDrawerTab('overview'); }}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          View Dossier
                        </button>
                        <span>|</span>

                        <button
                          type="button"
                          onClick={() => handleOpenUserModal(user)}
                          className="text-slate-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        <span>|</span>

                        {isSuspended ? (
                          <button
                            type="button"
                            onClick={() => onRestoreUser(user.id)}
                            className="text-emerald-700 hover:underline font-bold"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setSuspendingUserId(user.id); setSuspendReason(''); setSuspendModalOpen(true); }}
                            className="text-red-600 hover:underline font-bold"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Slide-Over Drawer */}
      {drawerUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                    {drawerUser.full_name}
                  </h3>
                  {drawerUser.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 font-mono">{drawerUser.email} • ID: {drawerUser.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setDrawerUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDrawerTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  drawerTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('listings')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  drawerTab === 'listings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Listings ({listings.filter(l => l.user_id === drawerUser.id).length})
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('membership')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  drawerTab === 'membership' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Membership
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('payments')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  drawerTab === 'payments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payments
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('verification')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  drawerTab === 'verification' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verification
              </button>
            </div>

            {/* Drawer Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {drawerTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account Standing:</span>
                      <span className="font-bold uppercase text-slate-800">{drawerUser.status || 'active'}</span>
                    </div>
                    {drawerUser.suspension_reason && (
                      <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200">
                        <strong>Suspension Reason:</strong> {drawerUser.suspension_reason}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone Contact:</span>
                      <span className="font-semibold text-slate-800">{drawerUser.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registered Business:</span>
                      <span className="font-semibold text-slate-800">{drawerUser.company_name || 'Individual Seller'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Membership Tier:</span>
                      <span className="font-bold text-purple-700">{drawerUser.tier_badge || 'Standard'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {drawerUser.status === 'suspended' ? (
                      <button
                        type="button"
                        onClick={() => onRestoreUser(drawerUser.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                      >
                        Restore Account
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setSuspendingUserId(drawerUser.id); setSuspendReason(''); setSuspendModalOpen(true); }}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                      >
                        Suspend Account
                      </button>
                    )}
                  </div>
                </div>
              )}

              {drawerTab === 'listings' && (
                <div className="space-y-2">
                  {listings.filter(l => l.user_id === drawerUser.id).map(l => (
                    <div key={l.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{l.title}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">₦{l.price.toLocaleString()}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'membership' && (
                <div className="space-y-3">
                  {subscriptions.filter(s => s.user_id === drawerUser.id).map(s => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{s.plan_name}</span>
                        <span className="text-purple-700 uppercase font-black">{s.status}</span>
                      </div>
                      <div className="text-slate-500">Duration: {s.billing_duration.toUpperCase()} • ₦{s.price.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Expires: {new Date(s.expiry_date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'payments' && (
                <div className="space-y-2">
                  {transactions.filter(t => t.user_id === drawerUser.id).map(t => (
                    <div key={t.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800">₦{t.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{t.paystack_reference}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'verification' && (
                <div className="space-y-3">
                  {verifications.filter(v => v.user_id === drawerUser.id).map(v => (
                    <div key={v.id} className="p-3.5 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="uppercase text-slate-700">{v.method.toUpperCase()} Verification</span>
                        <span className="text-emerald-700 uppercase">{v.status}</span>
                      </div>
                      <div className="text-slate-600 font-mono text-[11px]">Value: {v.value || 'Encrypted ID'}</div>
                      <div className="text-[10px] text-slate-400">Submitted: {new Date(v.submitted_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {suspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                Confirm Account Suspension
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Suspending this account will immediately conceal their active listings from the public marketplace. Reason is mandatory.
            </p>
            <textarea
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. Failure to provide FRSC registration papers or repeated buyer complaints."
              required
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSuspendModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Create/Edit Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              {editingUser ? 'Edit User / Seller Account' : 'Create User Account'}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Business Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Optional business entity name"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="user">User (Merchant / Buyer)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tier Badge</label>
                  <select
                    value={tierBadge}
                    onChange={(e) => setTierBadge(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="VIP">VIP</option>
                    <option value="Enterprise Gold">Enterprise Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
