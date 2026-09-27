import React, { useState } from 'react';
import { 
  Crown, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  MembershipFamily, 
  MembershipPlan, 
  Subscription, 
  User, 
  PlanDuration 
} from '../../types';

interface AdminMembershipsDeskProps {
  families: MembershipFamily[];
  plans: MembershipPlan[];
  subscriptions: Subscription[];
  users: User[];
  onSavePlan: (plan: MembershipPlan) => void;
  onSaveSubscription: (sub: Subscription) => void;
  onCreateManualSubscription: (data: any) => void;
  onUpdateSubscriptionStatus: (id: string, status: any) => void;
  canPerform: (perm: string) => boolean;
}

export const AdminMembershipsDesk: React.FC<AdminMembershipsDeskProps> = ({
  families,
  plans,
  subscriptions,
  users,
  onSavePlan,
  onSaveSubscription,
  onCreateManualSubscription,
  onUpdateSubscriptionStatus,
  canPerform,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'quotas' | 'subscriptions'>('plans');
  const [selectedFamilySlug, setSelectedFamilySlug] = useState('vehicles');

  // Plan Editor Modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Manual Subscription Modal
  const [manualSubModalOpen, setManualSubModalOpen] = useState(false);
  const [manualUserId, setManualUserId] = useState(users[0]?.id || 'user-emeka');
  const [manualPlanId, setManualPlanId] = useState(plans[0]?.id || 'plan-v-vip');
  const [manualDuration, setManualDuration] = useState<PlanDuration>('1m');
  const [manualReason, setManualReason] = useState('');

  // Form states for Plan
  const [planName, setPlanName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('0');
  const [price3m, setPrice3m] = useState('0');
  const [price6m, setPrice6m] = useState('0');
  const [price12m, setPrice12m] = useState('0');
  const [visibilityMultiplier, setVisibilityMultiplier] = useState('5x');
  const [featuredAds, setFeaturedAds] = useState('0');
  const [renewalInterval, setRenewalInterval] = useState('Every 24 hours');
  const [cashback, setCashback] = useState('0%');
  const [availableDurations, setAvailableDurations] = useState<PlanDuration[]>(['1m', '3m', '6m', '12m']);
  const [featuresText, setFeaturesText] = useState('');
  const [listingLimitNum, setListingLimitNum] = useState('10');

  const filteredPlans = plans.filter(p => p.family_slug === selectedFamilySlug);

  const handleOpenPlanModal = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanName(plan.name);
      setMonthlyPrice(plan.monthly_price.toString());
      setPrice3m(plan.price_3m.toString());
      setPrice6m(plan.price_6m.toString());
      setPrice12m(plan.price_12m.toString());
      setVisibilityMultiplier(plan.visibility_multiplier);
      setFeaturedAds(plan.featured_ads.toString());
      setRenewalInterval(plan.renewal_interval);
      setCashback(plan.cashback);
      setAvailableDurations(plan.available_durations || ['1m', '3m', '6m', '12m']);
      setFeaturesText(plan.features.join('\n'));
      const defLimit = plan.listing_limits['Vehicles'] || plan.listing_limits['Total'] || Object.values(plan.listing_limits)[0] || 10;
      setListingLimitNum(defLimit === 'Unlimited' ? '9999' : defLimit.toString());
    } else {
      setEditingPlan(null);
      setPlanName('');
      setMonthlyPrice('15000');
      setPrice3m('40000');
      setPrice6m('75000');
      setPrice12m('135000');
      setVisibilityMultiplier('10x');
      setFeaturedAds('3');
      setRenewalInterval('Every 24 hours');
      setCashback('5%');
      setAvailableDurations(['1m', '3m', '6m', '12m']);
      setFeaturesText('Direct buyer inquiries\nAuto-refresh boost\nSMS notifications');
      setListingLimitNum('25');
    }
    setPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) return;

    const mPrice = Number(monthlyPrice) || 0;
    const isFree = mPrice === 0;

    const feats = featuresText.split('\n').map(s => s.trim()).filter(Boolean);

    const updated: MembershipPlan = {
      id: editingPlan?.id || `plan-${selectedFamilySlug}-${Date.now()}`,
      name: planName.trim(),
      slug: editingPlan?.slug || `${selectedFamilySlug}-${planName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      family_slug: selectedFamilySlug,
      status: 'active',
      sort_order: editingPlan?.sort_order || (filteredPlans.length + 1),
      tier_level: editingPlan?.tier_level || filteredPlans.length,
      is_free: isFree,
      monthly_price: mPrice,
      price_3m: Number(price3m) || mPrice * 3,
      price_6m: Number(price6m) || mPrice * 6,
      price_12m: Number(price12m) || mPrice * 12,
      currency: 'NGN',
      visibility_multiplier: visibilityMultiplier,
      featured_ads: Number(featuredAds) || 0,
      renewal_interval: renewalInterval,
      cashback,
      listing_limits: {
        ...(editingPlan?.listing_limits || {}),
        'Total': Number(listingLimitNum) >= 9999 ? 'Unlimited' : Number(listingLimitNum),
      },
      features: feats,
      feature_level: editingPlan?.feature_level || 1,
      description: editingPlan?.description || `${planName} tier for ${selectedFamilySlug}`,
      available_durations: availableDurations,
    };

    onSavePlan(updated);
    setPlanModalOpen(false);
  };

  const handleManualSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPlan = plans.find(p => p.id === manualPlanId);
    if (!targetPlan) return;

    const p = manualDuration === '12m' ? targetPlan.price_12m :
              manualDuration === '6m' ? targetPlan.price_6m :
              manualDuration === '3m' ? targetPlan.price_3m : targetPlan.monthly_price;

    onCreateManualSubscription({
      userId: manualUserId,
      familySlug: targetPlan.family_slug,
      planId: targetPlan.id,
      planName: targetPlan.name,
      duration: manualDuration,
      price: p,
      reason: manualReason || 'Direct manual assignment by administrator',
    });
    setManualSubModalOpen(false);
    alert('Manual subscription activated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Membership &amp; Quota Governance
          </h2>
          <p className="text-xs text-slate-500">
            Control paid membership tiers, pricing, duration toggles, and listing limits without code modification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setManualSubModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>+ Manual Subscription</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPlanModal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Plan</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'plans' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Membership Plans &amp; Pricing ({plans.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('quotas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'quotas' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Listing Quota Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('subscriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'subscriptions' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Subscriptions Ledger ({subscriptions.length})
        </button>
      </div>

      {/* Family Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Family:</span>
        {families.map((f) => (
          <button
            key={f.slug}
            type="button"
            onClick={() => setSelectedFamilySlug(f.slug)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              selectedFamilySlug === f.slug
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: Plans & Pricing Cards */}
      {activeSubTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Tier {plan.tier_level}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{plan.status}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 font-['Plus_Jakarta_Sans'] mt-2">
                  {plan.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-800 font-['Plus_Jakarta_Sans']">
                    {plan.monthly_price === 0 ? 'Free' : `₦${plan.monthly_price.toLocaleString()}`}
                  </span>
                  {plan.monthly_price > 0 && <span className="text-xs text-slate-500 font-medium">/month</span>}
                </div>

                {/* Duration breakdown */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>3 Months:</span>
                    <strong>₦{plan.price_3m.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>6 Months:</span>
                    <strong>₦{plan.price_6m.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>12 Months (Annual):</span>
                    <strong>₦{plan.price_12m.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Badges & Entitlements */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 font-semibold">
                    Boost: {plan.visibility_multiplier}
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 font-semibold">
                    Featured Ads: {plan.featured_ads}
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 font-semibold">
                    Cashback: {plan.cashback}
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 font-semibold">
                    Auto-renew: {plan.renewal_interval}
                  </div>
                </div>

                {/* Available Duration Badges */}
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="font-semibold">Enabled Durations:</span>
                  {(plan.available_durations || ['1m', '3m', '6m', '12m']).map(d => (
                    <span key={d} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenPlanModal(plan)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Plan &amp; Pricing</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 2: Visual Quota Matrix */}
      {activeSubTab === 'quotas' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Listing Quota Allocation Matrix ({selectedFamilySlug.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500">
              Visual matrix showing maximum active ad quotas per membership tier. Quotas apply authoritatively to seller ad posts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold">
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Price (Monthly)</th>
                  <th className="py-3 px-4">Ad Limit (Total)</th>
                  <th className="py-3 px-4">Featured Ads</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Quick Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((p) => {
                  const limitVal = p.listing_limits['Vehicles'] || p.listing_limits['Total'] || Object.values(p.listing_limits)[0] || 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-500">Tier {p.tier_level}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-800">
                        {p.monthly_price === 0 ? 'Free' : `₦${p.monthly_price.toLocaleString()}`}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {limitVal === 'Unlimited' ? 'Unlimited' : `${limitVal} listings`}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-700">{p.featured_ads}</td>
                      <td className="py-3 px-4 font-bold text-amber-700">{p.visibility_multiplier}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenPlanModal(p)}
                          className="text-xs text-blue-600 hover:underline font-bold"
                        >
                          Modify Quota
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Subscriptions Ledger */}
      {activeSubTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-3">Family</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">Expiry Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No subscriptions recorded yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => {
                    const u = users.find(x => x.id === sub.user_id);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{u?.full_name || sub.user_id}</div>
                          <div className="text-[10px] text-slate-400">{u?.email}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{sub.plan_name}</td>
                        <td className="py-3 px-3 capitalize text-slate-600">{sub.family_slug}</td>
                        <td className="py-3 px-3 font-bold uppercase text-slate-700">{sub.billing_duration}</td>
                        <td className="py-3 px-3 text-slate-500">{new Date(sub.start_date).toLocaleDateString()}</td>
                        <td className="py-3 px-3 font-medium text-slate-700">{new Date(sub.expiry_date).toLocaleDateString()}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            sub.status === 'suspended' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {sub.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => onUpdateSubscriptionStatus(sub.id, 'suspended')}
                              className="text-[11px] text-purple-700 font-bold hover:underline"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onUpdateSubscriptionStatus(sub.id, 'active')}
                              className="text-[11px] text-emerald-700 font-bold hover:underline"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan Editor Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              {editingPlan ? `Edit ${editingPlan.name} Plan` : 'Create Membership Plan'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Price (₦)</label>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3-Month Price (₦)</label>
                  <input
                    type="number"
                    value={price3m}
                    onChange={(e) => setPrice3m(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6-Month Price (₦)</label>
                  <input
                    type="number"
                    value={price6m}
                    onChange={(e) => setPrice6m(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">12-Month Price (₦)</label>
                  <input
                    type="number"
                    value={price12m}
                    onChange={(e) => setPrice12m(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Available Durations Toggles (Section 17 requirement) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Available Billing Durations for this Plan
                </label>
                <div className="flex gap-4">
                  {(['1m', '3m', '6m', '12m'] as PlanDuration[]).map((dur) => (
                    <label key={dur} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availableDurations.includes(dur)}
                        onChange={(e) => {
                          if (e.target.checked) setAvailableDurations([...availableDurations, dur]);
                          else setAvailableDurations(availableDurations.filter(d => d !== dur));
                        }}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span className="font-semibold">{dur.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ad Quota (Count)</label>
                  <input
                    type="number"
                    value={listingLimitNum}
                    onChange={(e) => setListingLimitNum(e.target.value)}
                    placeholder="e.g. 50 (9999 for unlimited)"
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Featured Ads</label>
                  <input
                    type="number"
                    value={featuredAds}
                    onChange={(e) => setFeaturedAds(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visibility Boost</label>
                  <input
                    type="text"
                    value={visibilityMultiplier}
                    onChange={(e) => setVisibilityMultiplier(e.target.value)}
                    placeholder="e.g. 15x"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Features (one per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Subscription Modal */}
      {manualSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Issue Manual Subscription (Admin Override)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Grants authoritative membership access. Action will be permanently logged in the audit trail.
            </p>

            <form onSubmit={handleManualSubSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select User / Merchant</label>
                <select
                  value={manualUserId}
                  onChange={(e) => setManualUserId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Membership Plan</label>
                <select
                  value={manualPlanId}
                  onChange={(e) => setManualPlanId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>[{p.family_slug.toUpperCase()}] {p.name} - ₦{p.monthly_price.toLocaleString()}/mo</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Billing Duration</label>
                <select
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                >
                  <option value="1m">1 Month</option>
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                  <option value="12m">12 Months (Annual)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason / Authorization Reference</label>
                <input
                  type="text"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  placeholder="e.g. Bank wire settled directly via treasury"
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setManualSubModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm &amp; Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
