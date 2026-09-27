import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Calendar, 
  Eye, 
  Share2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldCheck,
  Building,
  Flag
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { MarketplaceService } from '../services/marketplaceService';
import { Listing, User } from '../types';
import { ListingGallery } from '../components/listing-detail/ListingGallery';
import { SellerProfileCard } from '../components/listing-detail/SellerProfileCard';
import { ReviewSection } from '../components/listing-detail/ReviewSection';
import { ReportModal } from '../components/listing-detail/ReportModal';
import { PromoteSheet } from '../components/listing-detail/PromoteSheet';
import { useAuth } from '../context/AuthContext';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | undefined>(() =>
    id ? MarketplaceService.getListingById(id) : undefined
  );
  const [seller, setSeller] = useState<User | undefined>(undefined);
  const [showPromote, setShowPromote] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isRecentlyPromoted = searchParams.get('promoted') === '1';

  useEffect(() => {
    if (id) {
      const item = MarketplaceService.getListingById(id);
      setListing(item);
      if (item) {
        MarketplaceService.recordView(item.id);
        const s = StorageService.getUserById(item.user_id);
        setSeller(s);
      }
    }
  }, [id]);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Listing Not Found</h2>
        <p className="text-xs text-slate-500">
          This ad may have expired or been deactivated by the seller.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.user_id;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[120px]">{listing.category}</span>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[200px]">{listing.title}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Promoted Success Banner */}
      {isRecentlyPromoted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-800 text-white flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-700/60 text-amber-300">
              <Sparkles className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <p className="font-extrabold text-sm">Boost Active: Your listing is now promoted!</p>
              <p className="text-xs text-purple-200 mt-0.5">
                Top rank algorithms and featured badges have been applied for maximum buyer discovery.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-purple-950 font-black text-xs">
            LIVE
          </span>
        </div>
      )}

      {/* Main 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Gallery & Content */}
        <div className="lg:col-span-2 space-y-6">
          <ListingGallery images={listing.images} title={listing.title} />

          {/* Core Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                  {listing.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {listing.location_lga}, {listing.location_state}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Posted {new Date(listing.created_date).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {listing.views_count || 1} views
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-left sm:text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Plus_Jakarta_Sans'] tracking-tight block">
                  ₦{listing.price.toLocaleString()}
                </span>
                {listing.negotiable && (
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Price Negotiable
                  </span>
                )}
              </div>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                Condition: {listing.condition}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {listing.category}
              </span>
              {listing.subcategory && (
                <span className="px-3 py-1 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                  {listing.subcategory}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Item Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Review Section */}
          <ReviewSection
            sellerId={listing.user_id}
            sellerName={listing.seller_name}
            listingId={listing.id}
            listingTitle={listing.title}
          />
        </div>

        {/* Right: Seller Profile & Actions */}
        <div className="space-y-6">
          <SellerProfileCard listing={listing} seller={seller} />

          {/* Owner Promotion CTA */}
          {isOwner && (
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl border border-purple-700 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 text-amber-300">
                  <Sparkles className="w-5 h-5 fill-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-['Plus_Jakarta_Sans']">
                    Boost This Ad
                  </h3>
                  <p className="text-[11px] text-purple-200">Get up to 320x more client inquiries</p>
                </div>
              </div>

              <p className="text-xs text-purple-100 leading-relaxed">
                Choose Top Search Rank, Urgent Badge or Featured Spotlight to jump ahead of competing sellers.
              </p>

              <button
                type="button"
                onClick={() => setShowPromote(true)}
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-md transition-all active:scale-[0.98]"
              >
                Promote My Listing Now
              </button>
            </div>
          )}

          {/* Safety Tips Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safety Tips
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Meet seller in a safe, public place.</li>
              <li>Inspect equipment, vehicle or goods before making any payment.</li>
              <li>Never send payments in advance, even for delivery fees.</li>
              <li>Report suspicious behavior or fraudulent sellers immediately.</li>
            </ul>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReport(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 hover:underline"
              >
                <Flag className="w-3.5 h-3.5" /> Report suspicious listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPromote && (
        <PromoteSheet
          isOpen={showPromote}
          onClose={() => setShowPromote(false)}
          listing={listing}
          onPromotionApplied={() => {
            setShowPromote(false);
            const updated = MarketplaceService.getListingById(listing.id);
            setListing(updated);
            navigate(`/marketplace/${listing.id}?promoted=1`);
          }}
        />
      )}

      {showReport && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          listing={listing}
        />
      )}
    </div>
  );
};
