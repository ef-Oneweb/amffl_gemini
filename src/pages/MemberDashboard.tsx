import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tag, 
  Receipt, 
  Crown, 
  PlusCircle, 
  ShieldCheck, 
  User as UserIcon,
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { ActivePlanCard } from '../components/dashboard/ActivePlanCard';
import { WalletCard } from '../components/dashboard/WalletCard';
import { UsageStatsCard } from '../components/dashboard/UsageStatsCard';
import { VerificationCard } from '../components/dashboard/VerificationCard';
import { MyListingsTab } from '../components/dashboard/MyListingsTab';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { Listing, Subscription, MembershipPlan, Transaction, SellerVerification } from '../types';

export const MemberDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'listings' | 'transactions'>('listings');
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [activeSub, setActiveSub] = useState<Subscription | undefined>(undefined);
  const [activePlan, setActivePlan] = useState<MembershipPlan | undefined>(undefined);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [verification, setVerification] = useState<SellerVerification | undefined>(undefined);

  const loadDashboardData = () => {
    if (!user) return;
    const listings = StorageService.getListings().filter(l => l.user_id === user.id);
    setUserListings(listings);

    const sub = StorageService.getUserActiveSubscription(user.id);
    setActiveSub(sub);

    if (sub) {
      const plan = StorageService.getPlans().find(p => p.id === sub.plan_id);
      setActivePlan(plan);
    } else {
      setActivePlan(undefined);
    }

    const txs = StorageService.getTransactions().filter(t => t.user_id === user.id);
    setUserTransactions(txs);

    const ver = StorageService.getVerifications().find(v => v.user_id === user.id);
    setVerification(ver);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?returnTo=/dashboard');
      return;
    }
    loadDashboardData();

    const handleUpdate = () => loadDashboardData();
    window.addEventListener('amffl_store_update', handleUpdate);
    return () => window.removeEventListener('amffl_store_update', handleUpdate);
  }, [user, isAuthenticated]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-700 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-emerald-100">
            {user.full_name?.charAt(0) || <UserIcon className="w-8 h-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
                Welcome, {user.full_name}
              </h1>

              {user.is_verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Seller
                </span>
              )}

              {user.tier_badge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                  <Crown className="w-3.5 h-3.5 text-purple-600" /> {user.tier_badge}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Member ID: <span className="font-mono text-slate-700">{user.id}</span> • Email: {user.email}
            </p>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/sell"
            className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Ad</span>
          </Link>

          <Link
            to="/premium-services"
            className="px-4 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Upgrade Tier</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActivePlanCard subscription={activeSub} plan={activePlan} />
        <WalletCard userId={user.id} />
        <UsageStatsCard listings={userListings} plan={activePlan} />
        <VerificationCard user={user} verification={verification} />
      </div>

      {/* Tabs navigation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 -mb-px ${
              activeTab === 'listings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>My Posted Listings ({userListings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border-b-2 -mb-px ${
              activeTab === 'transactions'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices &amp; Receipts ({userTransactions.length})</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'listings' ? (
          <MyListingsTab listings={userListings} onRefresh={loadDashboardData} />
        ) : (
          <TransactionsList transactions={userTransactions} />
        )}
      </div>
    </div>
  );
};
