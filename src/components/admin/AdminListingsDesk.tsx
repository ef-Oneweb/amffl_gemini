import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  AlertTriangle, 
  Archive, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Edit3, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Clock
} from 'lucide-react';
import { 
  Listing, 
  MarketplaceCategory, 
  ExtendedListingStatus, 
  User 
} from '../../types';
import { NIGERIAN_LOCATIONS } from '../../data/seedData';
import { AdminListingEditorModal } from './AdminListingEditorModal';

interface AdminListingsDeskProps {
  listings: Listing[];
  categories: MarketplaceCategory[];
  users: User[];
  onSaveListing: (listing: Listing) => void;
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string, reason: string) => void;
  onSuspendListing: (id: string, reason: string) => void;
  onArchiveListing: (id: string) => void;
  onRestoreListing: (id: string) => void;
  onSoftDeleteListing: (id: string) => void;
  onToggleFeature: (id: string, isFeatured: boolean) => void;
  adminName: string;
  canPerform: (perm: string) => boolean;
}

export const AdminListingsDesk: React.FC<AdminListingsDeskProps> = ({
  listings,
  categories,
  users,
  onSaveListing,
  onApproveListing,
  onRejectListing,
  onSuspendListing,
  onArchiveListing,
  onRestoreListing,
  onSoftDeleteListing,
  onToggleFeature,
  adminName,
  canPerform,
}) => {
  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'pending' | 'rejected' | 'suspended' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Bulk actions
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Reject / Reason Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Counts for tabs
  const publishedCount = listings.filter(l => l.status === 'active' && (!l.extended_status || l.extended_status === 'active')).length;
  const draftsCount = listings.filter(l => l.status === 'draft' || l.extended_status === 'draft').length;
  const pendingCount = listings.filter(l => l.extended_status === 'pending').length;
  const rejectedCount = listings.filter(l => l.extended_status === 'rejected').length;
  const suspendedCount = listings.filter(l => l.extended_status === 'suspended').length;
  const archivedCount = listings.filter(l => l.extended_status === 'archived').length;

  // Filtered dataset
  const filteredListings = listings.filter((l) => {
    // Tab filter
    if (activeTab === 'published' && (l.status !== 'active' || l.extended_status === 'rejected' || l.extended_status === 'suspended')) return false;
    if (activeTab === 'drafts' && l.status !== 'draft' && l.extended_status !== 'draft') return false;
    if (activeTab === 'pending' && l.extended_status !== 'pending') return false;
    if (activeTab === 'rejected' && l.extended_status !== 'rejected') return false;
    if (activeTab === 'suspended' && l.extended_status !== 'suspended') return false;
    if (activeTab === 'archived' && l.extended_status !== 'archived') return false;

    // Dropdown filters
    if (selectedCategory !== 'all' && l.category_slug !== selectedCategory) return false;
    if (selectedLocation !== 'all' && l.location_state.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    if (selectedStatus !== 'all') {
      const currentSt = l.extended_status || l.status;
      if (currentSt !== selectedStatus) return false;
    }

    // Keyword search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchSeller = (l.seller_name || '').toLowerCase().includes(q);
      const matchLoc = (l.location_state || '').toLowerCase().includes(q) || (l.location_lga || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSeller && !matchLoc) return false;
    }

    return true;
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage));
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedListingIds(paginatedListings.map(l => l.id));
    } else {
      setSelectedListingIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedListingIds.includes(id)) {
      setSelectedListingIds(selectedListingIds.filter(i => i !== id));
    } else {
      setSelectedListingIds([...selectedListingIds, id]);
    }
  };

  // Bulk Apply
  const handleApplyBulk = () => {
    if (!bulkAction) return;
    if (selectedListingIds.length === 0) {
      alert('Please select at least one listing to apply bulk action.');
      return;
    }

    if (bulkAction === 'approve') {
      if (!canPerform('listings.approve')) {
        alert('Permission Denied: Your admin role is not authorized to approve listings.');
        return;
      }
      selectedListingIds.forEach(id => onApproveListing(id));
      alert(`Approved ${selectedListingIds.length} listings.`);
    } else if (bulkAction === 'reject') {
      if (!canPerform('listings.reject')) {
        alert('Permission Denied: Your admin role is not authorized to reject listings.');
        return;
      }
      const reason = prompt('Enter rejection reason for bulk action:') || 'Failed editorial verification standards';
      selectedListingIds.forEach(id => onRejectListing(id, reason));
      alert(`Rejected ${selectedListingIds.length} listings.`);
    } else if (bulkAction === 'feature') {
      if (!canPerform('listings.feature')) {
        alert('Permission Denied: Your admin role is not authorized to feature listings.');
        return;
      }
      selectedListingIds.forEach(id => onToggleFeature(id, true));
      alert(`Featured ${selectedListingIds.length} listings.`);
    } else if (bulkAction === 'unfeature') {
      selectedListingIds.forEach(id => onToggleFeature(id, false));
    } else if (bulkAction === 'archive') {
      if (!canPerform('listings.archive')) {
        alert('Permission Denied: Your admin role is not authorized to archive listings.');
        return;
      }
      selectedListingIds.forEach(id => onArchiveListing(id));
      alert(`Archived ${selectedListingIds.length} listings.`);
    } else if (bulkAction === 'delete') {
      if (!canPerform('listings.delete')) {
        alert('Permission Denied: Your admin role cannot delete listings.');
        return;
      }
      if (confirm(`Are you sure you want to soft-delete ${selectedListingIds.length} listings?`)) {
        selectedListingIds.forEach(id => onSoftDeleteListing(id));
      }
    }
    setSelectedListingIds([]);
    setBulkAction('');
  };

  const handleOpenRejectModal = (listingId: string) => {
    setRejectingListingId(listingId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectingListingId) return;
    if (!rejectReason.trim()) {
      alert('Rejection reason is mandatory.');
      return;
    }
    onRejectListing(rejectingListingId, rejectReason.trim());
    setRejectModalOpen(false);
    setRejectingListingId(null);
  };

  const handleDuplicateListing = (target: Listing) => {
    const duplicated: Listing = {
      ...target,
      id: `lst-${Date.now()}`,
      title: `${target.title} (Copy)`,
      created_date: new Date().toISOString(),
      views_count: 0,
      contact_reveals: 0,
      extended_status: 'draft',
      status: 'draft',
    };
    onSaveListing(duplicated);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Row matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <span>Classified Listings</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {listings.length} items
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!canPerform('listings.create')) {
              alert('Permission Denied: Your role does not have listings.create permission.');
              return;
            }
            setEditingListing(null);
            setEditorModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* WordPress-style Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'all' ? 'text-blue-700 font-extrabold underline' : ''}`}
        >
          All ({listings.length})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('published'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'published' ? 'text-blue-700 font-extrabold underline' : ''}`}
        >
          Published ({publishedCount})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'pending' ? 'text-amber-700 font-extrabold underline' : ''}`}
        >
          Pending Review ({pendingCount})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('rejected'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'rejected' ? 'text-red-700 font-extrabold underline' : ''}`}
        >
          Rejected ({rejectedCount})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('suspended'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'suspended' ? 'text-purple-700 font-extrabold underline' : ''}`}
        >
          Suspended ({suspendedCount})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('drafts'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'drafts' ? 'text-blue-700 font-extrabold underline' : ''}`}
        >
          Drafts ({draftsCount})
        </button>
        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => { setActiveTab('archived'); setCurrentPage(1); }}
          className={`hover:text-blue-600 transition-colors ${activeTab === 'archived' ? 'text-slate-900 font-extrabold underline' : ''}`}
        >
          Archived ({archivedCount})
        </button>
      </div>

      {/* Control Bar: Bulk Actions & Dropdown Filters (matching screenshot) */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
          >
            <option value="">Bulk actions</option>
            <option value="approve">Approve selected</option>
            <option value="reject">Reject selected</option>
            <option value="feature">Feature selected</option>
            <option value="unfeature">Unfeature selected</option>
            <option value="archive">Archive selected</option>
            <option value="delete">Soft delete selected</option>
          </select>
          <button
            type="button"
            onClick={handleApplyBulk}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-700 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Filter by location</option>
            {NIGERIAN_LOCATIONS.map(l => (
              <option key={l.state} value={l.state}>{l.state}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Filter by category</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Listing"
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Classifieds Table matching screenshot */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedListings.length > 0 && selectedListingIds.length === paginatedListings.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </th>
                <th className="py-3 px-4 min-w-[260px]">Title</th>
                <th className="py-3 px-3 min-w-[130px]">Author</th>
                <th className="py-3 px-3 min-w-[160px]">Listing Categories</th>
                <th className="py-3 px-3 min-w-[140px]">Listing Locations</th>
                <th className="py-3 px-3 text-center w-20">Views</th>
                <th className="py-3 px-3 text-center w-24">Featured</th>
                <th className="py-3 px-3 text-center w-28">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedListings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No classified listings found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedListings.map((item) => {
                  const isSelected = selectedListingIds.includes(item.id);
                  const statusVal = item.extended_status || item.status;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-colors group ${isSelected ? 'bg-blue-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.id)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </td>

                      {/* Title & Quick Actions */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-blue-700 hover:text-blue-900 cursor-pointer flex items-center gap-1.5">
                          <span onClick={() => { setEditingListing(item); setEditorModalOpen(true); }}>
                            {item.title}
                          </span>
                          {item.promotion_type === 'top_rank' && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">TOP</span>
                          )}
                          {item.is_urgent && (
                            <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-bold">URGENT</span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                          ₦{item.price.toLocaleString()}
                        </div>

                        {/* WordPress-style Quick action row on hover */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => { setEditingListing(item); setEditorModalOpen(true); }}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Edit
                          </button>
                          <span>|</span>

                          {statusVal !== 'active' ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (!canPerform('listings.approve')) {
                                  alert('Permission Denied.');
                                  return;
                                }
                                onApproveListing(item.id);
                              }}
                              className="text-emerald-700 hover:underline font-semibold"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(item.id)}
                              className="text-amber-700 hover:underline font-semibold"
                            >
                              Reject
                            </button>
                          )}
                          <span>|</span>

                          <button
                            type="button"
                            onClick={() => {
                              const promptReason = prompt('Reason for suspension:') || 'Violation of terms';
                              onSuspendListing(item.id, promptReason);
                            }}
                            className="text-purple-600 hover:underline font-semibold"
                          >
                            Suspend
                          </button>
                          <span>|</span>

                          <button
                            type="button"
                            onClick={() => onArchiveListing(item.id)}
                            className="text-slate-600 hover:underline font-semibold"
                          >
                            Archive
                          </button>
                          <span>|</span>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Soft-delete "${item.title}"?`)) {
                                onSoftDeleteListing(item.id);
                              }
                            }}
                            className="text-red-600 hover:underline font-semibold"
                          >
                            Trash
                          </button>
                          <span>|</span>

                          <a
                            href={`/marketplace/${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                          >
                            <span>View</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span>|</span>

                          <button
                            type="button"
                            onClick={() => handleDuplicateListing(item)}
                            className="text-slate-600 hover:underline font-semibold"
                          >
                            Duplicate This
                          </button>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-3 font-medium text-slate-700">
                        <div>{item.seller_name || 'Seller'}</div>
                        <div className="text-[10px] text-slate-400">{item.seller_phone}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="font-semibold text-slate-800">{item.category}</span>
                        <div className="text-[10px] text-slate-400 capitalize">{item.family_slug}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <div>{item.location_state} State</div>
                        <div className="text-[10px] text-slate-400">{item.location_lga}</div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                        {item.views_count || 0}
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleFeature(item.id, !item.is_featured)}
                          title="Click to toggle featured"
                          className="hover:scale-110 transition-transform"
                        >
                          {item.is_featured ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                              YES
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">X</span>
                          )}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block ${
                          statusVal === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : statusVal === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : statusVal === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : statusVal === 'suspended'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {statusVal}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar matching screenshot */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} items
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">
              {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                Reject Listing &amp; Specify Reason
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              In accordance with AMFFL moderation rules, a mandatory reason must be provided to the seller.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate listing detected, unclear vehicle chassis photo, or unrealistic pricing."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Listing Editor Modal */}
      {editorModalOpen && (
        <AdminListingEditorModal
          listing={editingListing}
          categories={categories}
          users={users}
          onSave={(saved) => {
            onSaveListing(saved);
            setEditorModalOpen(false);
          }}
          onClose={() => setEditorModalOpen(false)}
          adminName={adminName}
        />
      )}
    </div>
  );
};
