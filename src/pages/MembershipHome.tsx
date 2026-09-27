import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Crown, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Car, 
  Building2, 
  ShoppingBag, 
  Sparkles, 
  Boxes 
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { MembershipCategoryModal } from '../components/membership/MembershipCategoryModal';

export const MembershipHome: React.FC = () => {
  const families = StorageService.getFamilies();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner matching Screenshot 1 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c5c36] via-[#11693e] to-[#084226] text-white p-8 sm:p-12 shadow-2xl border border-emerald-600/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>AMFFL Premium Membership</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tight leading-tight">
            Sell more. Get seen faster.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Choose a membership category that fits your needs with higher visibility, promotional tools and dedicated account management.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white text-emerald-950 font-black text-xs shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Choose a Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/promotions"
              className="px-6 py-3.5 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs border border-emerald-500/50 transition-all flex items-center gap-2"
            >
              <span>View Promotions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Highlight Cards matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 w-fit mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
            More Visibility
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Up to 320x more client exposure on higher tiers to accelerate buyers reaching your inventory.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 w-fit mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
            Flexible Durations
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose 1, 3, 6 or 12 months — pricing scales smoothly with up to 17% built-in term discounts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 w-fit mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
            Verified Seller Tools
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Badges, live engagement analytics, wallet cashback and dedicated account managers.
          </p>
        </div>
      </div>

      {/* Membership Categories Grid matching Screenshot 1 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Membership Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your primary business vertical to view tailored tiers and quotas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((fam) => (
            <Link
              key={fam.id}
              to={`/membership/${fam.slug}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-card-hover hover:border-emerald-500 transition-all space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: fam.icon_bg }}
                >
                  {fam.slug === 'vehicles' && <Car className="w-6 h-6 text-emerald-600" />}
                  {fam.slug === 'property' && <Building2 className="w-6 h-6 text-amber-600" />}
                  {fam.slug === 'others' && <ShoppingBag className="w-6 h-6 text-blue-600" />}
                  {fam.slug === 'others-lite' && <Sparkles className="w-6 h-6 text-pink-600" />}
                  {fam.slug === 'all-in-one' && <Boxes className="w-6 h-6 text-purple-600" />}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans'] group-hover:text-emerald-700 transition-colors">
                    {fam.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {fam.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
                <span>View Plans</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal Dialog matching Screenshot 1 */}
      {modalOpen && (
        <MembershipCategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          families={families}
        />
      )}
    </div>
  );
};
