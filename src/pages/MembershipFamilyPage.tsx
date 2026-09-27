import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { MembershipService } from '../services/membershipService';
import { MembershipPlan, PlanDuration, MembershipFamily } from '../types';
import { DurationSelector } from '../components/membership/DurationSelector';
import { MembershipPlanCard } from '../components/membership/MembershipPlanCard';
import { ComparePlansModal } from '../components/membership/ComparePlansModal';
import { PaystackModal } from '../components/paystack/PaystackModal';
import { useAuth } from '../context/AuthContext';

export const MembershipFamilyPage: React.FC = () => {
  const { family } = useParams<{ family: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const families = StorageService.getFamilies();
  const allPlans = StorageService.getPlans();

  const currentFamilySlug = family || 'vehicles';
  const currentFamily = families.find(f => f.slug === currentFamilySlug) || families[0];

  const plans = allPlans.filter(p => p.family_slug === currentFamilySlug);

  const [duration, setDuration] = useState<PlanDuration>('1m');
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Paystack checkout modal state
  const [subscribingPlan, setSubscribingPlan] = useState<MembershipPlan | null>(null);

  const handleToggleCompare = (planId: string) => {
    if (comparedPlanIds.includes(planId)) {
      setComparedPlanIds(comparedPlanIds.filter(id => id !== planId));
    } else {
      if (comparedPlanIds.length >= 3) {
        alert('You can compare a maximum of 3 plans at a time.');
        return;
      }
      setComparedPlanIds([...comparedPlanIds, planId]);
    }
  };

  const handleSubscribeClick = (plan: MembershipPlan) => {
    if (!user) {
      navigate(`/login?returnTo=/membership/${currentFamilySlug}`);
      return;
    }
    setSubscribingPlan(plan);
  };

  const handlePaystackSuccess = (paystackRef: string, walletUsed: number) => {
    if (!subscribingPlan || !user) return;
    const result = MembershipService.activateSubscription(
      user.id,
      subscribingPlan.id,
      duration,
      walletUsed,
      paystackRef
    );
    setSubscribingPlan(null);
    navigate(`/payment-success?reference=${paystackRef}&planId=${subscribingPlan.id}`);
  };

  const comparedPlans = plans.filter(p => comparedPlanIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
            {currentFamily?.name} Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose a membership plan that gives your business more listings, visibility, promotion and seller tools.
          </p>
        </div>

        {/* Family Switcher Dropdown matching Screenshot 2 */}
        <div className="relative">
          <select
            value={currentFamilySlug}
            onChange={(e) => navigate(`/membership/${e.target.value}`)}
            className="appearance-none bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 font-extrabold text-xs rounded-full px-5 py-2.5 pr-9 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {families.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Duration Selector Tabs matching Screenshot 2 */}
      <DurationSelector
        duration={duration}
        onChangeDuration={setDuration}
        onOpenCompare={() => setShowCompareModal(true)}
        compareCount={comparedPlanIds.length}
      />

      {/* Plans Grid (Up to 9 Tiers matching Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <MembershipPlanCard
            key={plan.id}
            plan={plan}
            duration={duration}
            isCompared={comparedPlanIds.includes(plan.id)}
            onToggleCompare={handleToggleCompare}
            onSubscribe={handleSubscribeClick}
          />
        ))}
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <ComparePlansModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          plans={comparedPlans.length > 0 ? comparedPlans : plans.slice(0, 3)}
          duration={duration}
          onSelectPlan={handleSubscribeClick}
          onClearCompare={() => setComparedPlanIds([])}
        />
      )}

      {/* Paystack Checkout Modal */}
      {subscribingPlan && user && (
        <PaystackModal
          isOpen={!!subscribingPlan}
          onClose={() => setSubscribingPlan(null)}
          amount={
            duration === '1m'
              ? subscribingPlan.monthly_price
              : duration === '3m'
              ? subscribingPlan.price_3m
              : duration === '6m'
              ? subscribingPlan.price_6m
              : subscribingPlan.price_12m
          }
          email={user.email}
          userId={user.id}
          metadata={{
            purpose: 'subscription',
            planId: subscribingPlan.id,
            planName: `${subscribingPlan.name} (${currentFamily.name})`,
            duration: duration,
          }}
          onSuccess={handlePaystackSuccess}
        />
      )}
    </div>
  );
};
