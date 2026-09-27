import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Sparkles, Eye, PhoneCall, Trash2, Power, ExternalLink } from 'lucide-react';
import { Listing } from '../../types';
import { StorageService } from '../../services/storageService';
import { PromoteSheet } from '../listing-detail/PromoteSheet';

interface MyListingsTabProps {
  listings: Listing[];
  onRefresh: () => void;
}

export const MyListingsTab: React.FC<MyListingsTabProps> = ({ listings, onRefresh }) => {
  const [promoteListing, setPromoteListing] = useState<Listing | null>(null);

  const handleToggleStatus = (listing: Listing) => {
    const updatedStatus = listing.status === 'active' ? 'inactive' : 'active';
    StorageService.saveListing({ ...listing, status: updatedStatus });
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently remove this listing?')) {
      StorageService.deleteListing(id);
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
            My Posted Listings ({listings.length})
          </h3>
          <p className="text-xs text-slate-500">Manage active items, track views, and apply promotional boosts</p>
        </div>

        <Link
          to="/sell"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Post New Ad
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-slate-600 font-bold text-sm">You haven&apos;t posted any listings yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use your active membership quota to post vehicles, equipment, machinery, or property today.
          </p>
          <Link
            to="/sell"
            className="inline-block px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm"
          >
            Post Your First Ad
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {listings.map((l) => (
            <div
              key={l.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left: Thumbnail & details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={l.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                  alt={l.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/marketplace/${l.id}`}
                      className="font-extrabold text-sm text-slate-900 hover:text-emerald-700 truncate max-w-sm font-['Plus_Jakarta_Sans']"
                    >
                      {l.title}
                    </Link>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        l.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {l.status}
                    </span>

                    {l.is_featured && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> Boosted
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    ₦{l.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {l.views_count || 0} views
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> {l.contact_reveals || 0} inquiries
                    </span>
                    <span>•</span>
                    <span>{l.location_state}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setPromoteListing(l)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1.5 border border-purple-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Promote
                </button>

                <Link
                  to={`/marketplace/${l.id}`}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="View in Marketplace"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(l)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title={l.status === 'active' ? 'Deactivate Ad' : 'Activate Ad'}
                >
                  <Power className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(l.id)}
                  className="p-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Ad"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {promoteListing && (
        <PromoteSheet
          isOpen={!!promoteListing}
          onClose={() => setPromoteListing(null)}
          listing={promoteListing}
          onPromotionApplied={() => {
            setPromoteListing(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
