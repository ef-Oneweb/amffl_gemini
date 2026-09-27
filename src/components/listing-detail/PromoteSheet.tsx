import React, { useState } from 'react';
import { X, Flame, Sparkles, TrendingUp, RotateCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { Listing, PromotionPackage, PromotionTierOption } from '../../types';
import { StorageService } from '../../services/storageService';
import { MembershipService } from '../../services/membershipService';
import { PaystackModal } from '../paystack/PaystackModal';
import { useAuth } from '../../context/AuthContext';

interface PromoteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  onPromotionApplied: () => void;
}

export const PromoteSheet: React.FC<PromoteSheetProps> = ({
  isOpen,
  onClose,
  listing,
  onPromotionApplied,
}) => {
  const { user } = useAuth();
  const packages = StorageService.getPromotions();

  const [selectedPkg, setSelectedPkg] = useState<PromotionPackage>(packages[0] || {} as any);
  const [selectedTier, setSelectedTier] = useState<PromotionTierOption>(
    packages[0]?.tier_options[0] || ({} as any)
  );
  const [showPaystack, setShowPaystack] = useState(false);

  if (!isOpen) return null;

  const handleSelectPackage = (pkg: PromotionPackage) => {
    setSelectedPkg(pkg);
    setSelectedTier(pkg.tier_options[0]);
  };

  const handleProceedToPayment = () => {
    setShowPaystack(true);
  };

  const handlePaystackSuccess = (paystackRef: string, walletUsed: number) => {
    if (!user) return;
    MembershipService.applyPromotion(
      listing.id,
      selectedPkg,
      selectedTier,
      user.id,
      walletUsed,
      paystackRef
    );
    setShowPaystack(false);
    onPromotionApplied();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 to-green-800 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-700/50 px-2 py-0.5 rounded-full">
                Listing Booster
              </span>
              <h2 className="text-xl font-extrabold mt-1 font-['Plus_Jakarta_Sans']">
                Promote &amp; Boost Your Ad
              </h2>
              <p className="text-xs text-emerald-100/90 truncate max-w-sm mt-0.5">
                Targeted promotion for &quot;{listing.title}&quot;
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Step 1: Package Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Step 1: Choose Promotion Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packages.map((pkg) => {
                  const isSelected = selectedPkg.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${
                            pkg.type === 'top_rank' ? 'bg-purple-100 text-purple-700' :
                            pkg.type === 'urgent' ? 'bg-red-100 text-red-700' :
                            pkg.type === 'featured' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {pkg.type === 'top_rank' && <TrendingUp className="w-4 h-4" />}
                            {pkg.type === 'urgent' && <Flame className="w-4 h-4" />}
                            {pkg.type === 'featured' && <Sparkles className="w-4 h-4" />}
                            {pkg.type === 'bump_up' && <RotateCw className="w-4 h-4" />}
                          </div>
                          <span className="font-extrabold text-xs text-slate-900">{pkg.name}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tier Duration Selection */}
            {selectedPkg && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Step 2: Select Duration &amp; Price
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedPkg.tier_options.map((tier) => {
                    const isSelected = selectedTier?.id === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                            : 'border-slate-200 text-slate-800 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs font-bold">{tier.label}</span>
                        <span className={`block text-xs font-extrabold mt-1 ${isSelected ? 'text-white' : 'text-emerald-700'}`}>
                          ₦{tier.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Selected Boost:</span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {selectedPkg.name} ({selectedTier?.label})
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Amount Due:</span>
                <p className="text-lg font-black text-emerald-700 font-['Plus_Jakarta_Sans']">
                  ₦{selectedTier?.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-800/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Paystack Modal Trigger */}
      {showPaystack && user && (
        <PaystackModal
          isOpen={showPaystack}
          onClose={() => setShowPaystack(false)}
          amount={selectedTier?.price || 0}
          email={user.email}
          userId={user.id}
          metadata={{
            purpose: 'promotion',
            listingId: listing.id,
            packageName: `${selectedPkg.name} (${selectedTier.label})`,
          }}
          onSuccess={handlePaystackSuccess}
        />
      )}
    </>
  );
};
