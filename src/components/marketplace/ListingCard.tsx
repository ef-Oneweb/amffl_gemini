import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, Sparkles, Flame, Crown, ArrowUpRight } from 'lucide-react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
  showRank?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, showRank = false }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Promotion badge styles
  const renderPromotionBadge = () => {
    if (!listing.promotion_type) return null;
    const isPromoActive = listing.promotion_expiry_date 
      ? new Date(listing.promotion_expiry_date) > new Date()
      : true;

    if (!isPromoActive) return null;

    switch (listing.promotion_type) {
      case 'top_rank':
        return (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-xs">
            <Crown className="w-3 h-3 text-amber-300 fill-amber-300" /> TOP RANK
          </span>
        );
      case 'urgent':
        return (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-xs animate-pulse">
            <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" /> URGENT
          </span>
        );
      case 'featured':
        return (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> FEATURED
          </span>
        );
      case 'bump_up':
        return (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-xs">
            <ArrowUpRight className="w-3 h-3" /> BOOSTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden hover:-translate-y-0.5">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {renderPromotionBadge()}

        {/* Condition Tag */}
        <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
          {listing.condition}
        </span>

        {/* Product Image */}
        <Link to={`/marketplace/${listing.id}`} className="block w-full h-full">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className={`absolute bottom-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-red-500 shadow-xs'
          }`}
          aria-label="Save listing"
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={`/marketplace/${listing.id}`}
            className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
            title={listing.title}
          >
            {listing.title}
          </Link>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-sm sm:text-base font-extrabold text-emerald-700 tracking-tight font-['Plus_Jakarta_Sans']">
              ₦{listing.price.toLocaleString()}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Negotiable
              </span>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
          {/* Location */}
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {listing.location_lga ? `${listing.location_lga}, ${listing.location_state}` : listing.location_state}
            </span>
          </div>

          {/* Seller Trust & Category */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="text-slate-400 truncate max-w-[120px]">
              {listing.subcategory || listing.category}
            </span>

            {listing.seller_verified && (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            )}
          </div>

          {/* Optional rank debugging or display */}
          {showRank && listing.computed_rank !== undefined && (
            <div className="text-[9px] text-slate-400 text-right">
              Score: {listing.computed_rank} pts
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
