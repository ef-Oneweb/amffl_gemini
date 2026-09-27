import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Building, 
  Lock, 
  Award,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Listing, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MarketplaceService } from '../../services/marketplaceService';

interface SellerProfileCardProps {
  listing: Listing;
  seller?: User;
}

export const SellerProfileCard: React.FC<SellerProfileCardProps> = ({ listing, seller }) => {
  const { isAuthenticated } = useAuth();
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const rawPhone = listing.seller_phone || seller?.phone || '+234 800 000 0000';
  const cleanPhoneForWhatsApp = rawPhone.replace(/[^0-9]/g, '');

  const handleRevealPhone = () => {
    setPhoneRevealed(true);
    MarketplaceService.recordContactReveal(listing.id);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Seller Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-700 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-emerald-100">
          {seller?.full_name?.charAt(0) || listing.seller_name?.charAt(0) || 'S'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-extrabold text-slate-900 text-base font-['Plus_Jakarta_Sans'] truncate">
              {seller?.full_name || listing.seller_name || 'Verified Merchant'}
            </h3>
            {listing.seller_verified && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            )}
          </div>

          {(seller?.company_name || listing.seller_tier) && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{seller?.company_name || 'Verified Commercial Dealer'}</span>
            </p>
          )}

          {listing.seller_tier && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              <Award className="w-3 h-3 text-purple-600" /> {listing.seller_tier} Member
            </div>
          )}
        </div>
      </div>

      {/* Meta Stats */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 text-[11px]">Member Since:</span>
          <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {seller?.member_since || 'Active Member'}
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-[11px]">Identity Status:</span>
          <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            {listing.seller_verified ? 'NIN / BVN Verified' : 'Standard Member'}
          </p>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="space-y-3">
        {!isAuthenticated ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2.5">
            <Lock className="w-5 h-5 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Contact Details Protected</p>
            <p className="text-[11px] text-slate-500">Sign in to your free account to view seller phone & WhatsApp numbers.</p>
            <Link
              to={`/login?returnTo=/marketplace/${listing.id}`}
              className="block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Sign In to View Contact
            </Link>
          </div>
        ) : (
          <>
            {/* Phone Button */}
            {!phoneRevealed ? (
              <button
                type="button"
                onClick={handleRevealPhone}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                <span>Show Phone Number</span>
              </button>
            ) : (
              <a
                href={`tel:${rawPhone}`}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all font-mono"
              >
                <Phone className="w-4 h-4" />
                <span>Call {rawPhone}</span>
              </a>
            )}

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${cleanPhoneForWhatsApp}?text=${encodeURIComponent(
                `Hello, I am interested in your listing: "${listing.title}" on AMFFL Marketplace (₦${listing.price.toLocaleString()}). Is it still available?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat via WhatsApp</span>
            </a>
          </>
        )}
      </div>

      {/* Security note */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Safety First:</strong> Never pay before inspecting items in person. Meet in public locations.
        </p>
      </div>
    </div>
  );
};
