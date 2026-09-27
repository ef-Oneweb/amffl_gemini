import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  TrendingUp, 
  RotateCw, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { PromotionPackage, PromotionTierOption, Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { PaystackModal } from '../components/paystack/PaystackModal';
import { MembershipService } from '../services/membershipService';
import { useNavigate } from 'react-router-dom';

export const PromotionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const packages = StorageService.getPromotions();
  const myListings = user ? StorageService.getListings().filter(l => l.user_id === user.id && l.status === 'active') : [];

  const [selectedPkg, setSelectedPkg] = useState<PromotionPackage | null>(null);
  const [selectedTier, setSelectedTier] = useState<PromotionTierOption | null>(null);
  const [targetListingId, setTargetListingId] = useState<string>(myListings[0]?.id || '');
  const [showPaystack, setShowPaystack] = useState(false);

  const handleSelectPackageTier = (pkg: PromotionPackage, tier: PromotionTierOption) => {
    setSelectedPkg(pkg);
    setSelectedTier(tier);
  };

  const handleProceed = () => {
    if (!user) {
      navigate('/login?returnTo=/promotions');
      return;
    }
    if (!targetListingId) {
      alert('Please select one of your listings to boost.');
      return;
    }
    setShowPaystack(true);
  };

  const handlePaystackSuccess = (paystackRef: string, walletUsed: number) => {
    if (!selectedPkg || !selectedTier || !targetListingId || !user) return;
    MembershipService.applyPromotion(
      targetListingId,
      selectedPkg,
      selectedTier,
      user.id,
      walletUsed,
      paystackRef
    );
    setShowPaystack(false);
    navigate(`/marketplace/${targetListingId}?promoted=1`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header matching Screenshot 3 */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
          Promotions &amp; Boosts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Standalone promotional packages to boost your ads. Credits can be applied to any qualifying listing.
        </p>
      </div>

      {/* 4 Promotion Package Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-card-hover transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      pkg.type === 'featured'
                        ? 'bg-emerald-50 text-emerald-700'
                        : pkg.type === 'urgent'
                        ? 'bg-red-50 text-red-600'
                        : pkg.type === 'top_rank'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {pkg.type === 'featured' && <Sparkles className="w-5 h-5" />}
                    {pkg.type === 'urgent' && <Flame className="w-5 h-5" />}
                    {pkg.type === 'top_rank' && <TrendingUp className="w-5 h-5" />}
                    {pkg.type === 'bump_up' && <RotateCw className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                      {pkg.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {pkg.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Tiers List matching Screenshot 3 */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {pkg.tier_options.map((tier) => {
                    const isSelected = selectedPkg?.id === pkg.id && selectedTier?.id === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleSelectPackageTier(pkg, tier)}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-900 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80 text-slate-800'
                        }`}
                      >
                        <span>{tier.label}</span>
                        <span className="font-extrabold font-['Plus_Jakarta_Sans']">
                          ₦{tier.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackageTier(pkg, pkg.tier_options[0])}
                className="w-full py-2.5 rounded-full border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-colors"
              >
                Select Package
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Boost & Ad Chooser Box */}
      {selectedPkg && selectedTier && (
        <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Ready to Boost
              </span>
              <h3 className="text-xl font-black font-['Plus_Jakarta_Sans'] mt-0.5">
                {selectedPkg.name} ({selectedTier.label}) — ₦{selectedTier.price.toLocaleString()}
              </h3>
            </div>

            {myListings.length > 0 ? (
              <div className="flex items-center gap-3">
                <select
                  value={targetListingId}
                  onChange={(e) => setTargetListingId(e.target.value)}
                  className="bg-emerald-900 border border-emerald-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {myListings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title.slice(0, 32)}... (₦{l.price.toLocaleString()})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
                >
                  Pay via Paystack
                </button>
              </div>
            ) : (
              <div className="text-xs text-emerald-200">
                You don&apos;t have any active listings yet.{' '}
                <button
                  onClick={() => navigate('/sell')}
                  className="text-white font-bold underline hover:text-emerald-300 ml-1"
                >
                  Post an ad first
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promotion Credit Engine Section matching Screenshot 3 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Promotion Credit Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every membership plan can grant promotional credits. Supported promotion types:
          </p>
        </div>

        {/* 6 Grid items matching Screenshot 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Featured Ad',
            'Top of Search',
            'Category Spotlight',
            'Homepage Slider',
            'Urgent Badge',
            'Boosted Ad',
          ].map((type) => (
            <div
              key={type}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-bold text-slate-800"
            >
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>{type}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Credits support grant, consume, refund, expiry and manual admin adjustment.
        </p>
      </div>

      {/* Paystack Modal */}
      {showPaystack && user && selectedTier && selectedPkg && (
        <PaystackModal
          isOpen={showPaystack}
          onClose={() => setShowPaystack(false)}
          amount={selectedTier.price}
          email={user.email}
          userId={user.id}
          metadata={{
            purpose: 'promotion',
            listingId: targetListingId,
            packageName: `${selectedPkg.name} (${selectedTier.label})`,
          }}
          onSuccess={handlePaystackSuccess}
        />
      )}
    </div>
  );
};
