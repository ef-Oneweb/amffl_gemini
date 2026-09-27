import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Trash2, 
  Star, 
  Ban, 
  Search, 
  Filter, 
  FileWarning, 
  MessageSquare, 
  Sliders, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { ListingReport, Review, Listing, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminModerationDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending_ads' | 'reports' | 'reviews' | 'blacklist'>('pending_ads');
  
  // State
  const [listings, setListings] = useState<Listing[]>(() => StorageService.getListings());
  const [reports, setReports] = useState<ListingReport[]>(() => StorageService.getReports());
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rejection modal
  const [rejectingListing, setRejectingListing] = useState<Listing | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejection, setCustomRejection] = useState('');

  // Keyword blacklist mock state
  const [blacklistKeywords, setBlacklistKeywords] = useState<string[]>([
    'free money',
    'send transport fare first',
    'crypto investment double',
    'whatsapp me privately for bank details',
    'send bvn for giveaway',
    'pay before inspection',
    'ponzi',
    'sugar mummy connection',
    'fake alert'
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  const refresh = () => {
    setListings(StorageService.getListings());
    setReports(StorageService.getReports());
    setReviews(StorageService.getReviews());
  };

  const canModerate = canPerform('moderate_listings');

  // Pending listings
  const pendingListings = listings.filter(l => l.status === 'pending_approval' || (l as any).status === 'under_review');
  const openReports = reports.filter(r => r.status === 'open');

  // Actions for Listings
  const handleApproveListing = (listing: Listing) => {
    if (!canModerate) {
      alert('Your current role does not have permission to moderate listings.');
      return;
    }
    const updated: Listing = {
      ...listing,
      status: 'active',
      extended_status: 'active'
    };
    StorageService.saveListing(updated);
    StorageService.logAuditEvent({
      action: 'listing_approve',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'listing',
      target_id: listing.id,
      details: { title: listing.title, price: listing.price, seller_id: listing.user_id }
    });
    refresh();
  };

  const handleRejectListing = () => {
    if (!rejectingListing || !canModerate) return;
    const finalReason = customRejection.trim() || rejectionReason || 'Violates AMFFL marketplace listing policy';
    
    const updated: Listing = {
      ...rejectingListing,
      status: 'rejected',
      extended_status: 'rejected',
      rejection_reason: finalReason
    };
    StorageService.saveListing(updated);

    StorageService.logAuditEvent({
      action: 'listing_reject',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'listing',
      target_id: rejectingListing.id,
      details: {
        title: rejectingListing.title,
        seller_id: rejectingListing.user_id,
        reason: finalReason
      }
    });

    setRejectingListing(null);
    setRejectionReason('');
    setCustomRejection('');
    refresh();
  };

  // Actions for Reports
  const handleActionReport = (report: ListingReport, action: 'dismissed' | 'actioned') => {
    if (!canModerate) return;
    StorageService.updateReportStatus(
      report.id,
      action,
      action === 'actioned' ? 'Listing suspended and removed due to user safety complaint.' : 'Dismissed following inspection.'
    );

    if (action === 'actioned') {
      const offending = StorageService.getListings().find(l => l.id === report.listing_id);
      if (offending) {
        offending.status = 'inactive';
        StorageService.saveListing(offending);
      }
    }

    StorageService.logAuditEvent({
      action: 'report_action',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'report',
      target_id: report.id,
      details: { resolution: action, listing_id: report.listing_id, reason: report.reason }
    });

    refresh();
  };

  // Actions for Reviews
  const handleUpdateReviewStatus = (id: string, status: 'published' | 'hidden') => {
    if (!canModerate) return;
    StorageService.updateReviewStatus(id, status);
    refresh();
  };

  const handleDeleteReview = (id: string) => {
    if (!canModerate) return;
    const filtered = reviews.filter(r => r.id !== id);
    localStorage.setItem('amffl_reviews', JSON.stringify(filtered));
    refresh();
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    if (!blacklistKeywords.includes(newKeyword.trim().toLowerCase())) {
      setBlacklistKeywords([...blacklistKeywords, newKeyword.trim().toLowerCase()]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setBlacklistKeywords(blacklistKeywords.filter(k => k !== keyword));
  };

  const nigerianRejectionPresets = [
    'Unrealistic or suspicious pricing (possible advance-fee fraud)',
    'Watermarked photos with contact phone numbers/external URLs',
    'Duplicate listing detected from this seller account',
    'Category mismatch (placed in wrong category/department)',
    'Restricted or prohibited items under Nigerian trade laws',
    'Incomplete or misleading product specifications',
    'Low resolution or stolen stock photography'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            Trust, Safety &amp; Content Moderation Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative moderation of pending listings, user fraud reports, buyer reviews, and keyword anti-fraud filters.
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{pendingListings.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Ads Pending Review</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{openReports.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Open Fraud Reports</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{reviews.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Buyer Reviews Moderated</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{blacklistKeywords.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Active Keyword Filters</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('pending_ads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending_ads'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Classifieds</span>
          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
            {pendingListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>User Reports &amp; Flags</span>
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
            {openReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews &amp; Ratings ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blacklist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'blacklist'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Fraud Keywords Filter</span>
        </button>
      </div>

      {/* TAB 1: PENDING ADS */}
      {activeTab === 'pending_ads' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Listings Awaiting Moderation Approval ({pendingListings.length})
            </h3>
            <span className="text-xs text-slate-500">
              Standard review turnaround: &lt; 15 minutes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item / Photo</th>
                  <th className="py-3 px-4">Seller Details</th>
                  <th className="py-3 px-4">Price / Terms</th>
                  <th className="py-3 px-4">Category / State</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      All classifieds have been reviewed. Moderation queue is clear!
                    </td>
                  </tr>
                ) : (
                  pendingListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 max-w-xs line-clamp-1">{listing.title}</div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {listing.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{listing.seller_name || 'Seller'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{listing.user_id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        ₦{listing.price.toLocaleString()}
                        {listing.negotiable && (
                          <span className="text-[10px] font-normal text-slate-400 block">Negotiable</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-700 block">{listing.category_slug}</span>
                        <span className="text-[10px] text-slate-400">{listing.location_state}, {listing.location_lga}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(listing.created_date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveListing(listing)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingListing(listing)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER FRAUD & SAFETY REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Community Incident &amp; Flagged Listings Queue ({reports.length})
            </h3>
            <span className="text-xs text-slate-500">
              User-submitted scam, copyright &amp; safety alerts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Reported Listing</th>
                  <th className="py-3 px-4">Violation Category</th>
                  <th className="py-3 px-4">Details / Evidence</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No active reports. The marketplace is running securely.
                    </td>
                  </tr>
                ) : (
                  reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{rep.listing_title}</span>
                        <span className="text-[10px] font-mono text-slate-400">Listing ID: {rep.listing_id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          {rep.reason}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={rep.details}>
                        {rep.details}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {rep.reporter_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rep.status === 'open'
                            ? 'bg-amber-100 text-amber-800'
                            : rep.status === 'actioned'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {rep.status === 'open' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleActionReport(rep, 'actioned')}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                              title="Deactivate listing & penalize seller"
                            >
                              <Ban className="w-3.5 h-3.5" /> Deactivate Ad
                            </button>
                            <button
                              onClick={() => handleActionReport(rep, 'dismissed')}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                              title="Dismiss report as invalid"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Buyer Reviews &amp; Seller Ratings ({reviews.length})
            </h3>
            <span className="text-xs text-slate-500">
              Moderate fraudulent or abusive customer feedback
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Target Seller / Listing</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Feedback Content</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{rev.reviewer_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-mono text-[11px] block">{rev.seller_id}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                        {rev.listing_title || 'Direct seller review'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-700" title={rev.comment}>
                      {rev.comment}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rev.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'published' ? (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'published')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Publish Review"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'hidden')}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                            title="Hide Review"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Delete Spam Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BLACKLIST KEYWORDS */}
      {activeTab === 'blacklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                Automated Nigerian Anti-Fraud Word Filter
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Classified ads containing any of these expressions are automatically held for manual moderator review before going live.
              </p>
            </div>
          </div>

          {/* Add keyword */}
          <form onSubmit={handleAddKeyword} className="flex gap-3">
            <input
              type="text"
              placeholder="Add suspicious phrase (e.g., 'send dispatch money first')..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Add to Blacklist
            </button>
          </form>

          {/* Keyword tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {blacklistKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="hover:text-rose-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Listing Rejection Modal */}
      {rejectingListing && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                  Reject Classified Listing
                </h3>
                <p className="text-xs text-slate-500">Provide an authoritative reason for seller email notice</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block">{rejectingListing.title}</span>
              <span className="text-[10px] text-slate-500 font-mono">ID: {rejectingListing.id} • ₦{rejectingListing.price.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Select Compliance Violation
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {nigerianRejectionPresets.map((reason, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      rejectionReason === reason
                        ? 'border-rose-400 bg-rose-50/50 text-rose-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="adRejectionReason"
                      checked={rejectionReason === reason}
                      onChange={() => setRejectionReason(reason)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Or Custom Feedback
              </label>
              <textarea
                rows={2}
                placeholder="Give seller specific instructions to fix listing..."
                value={customRejection}
                onChange={(e) => setCustomRejection(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingListing(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectListing}
                disabled={!rejectionReason && !customRejection.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                Confirm Ad Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
