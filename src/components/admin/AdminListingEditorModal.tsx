import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  Tag, 
  Crown, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Layers,
  Calendar,
  Building,
  Car
} from 'lucide-react';
import { 
  Listing, 
  MarketplaceCategory, 
  ListingCondition, 
  ExtendedListingStatus, 
  User 
} from '../../types';
import { NIGERIAN_LOCATIONS } from '../../data/seedData';

interface AdminListingEditorModalProps {
  listing?: Listing | null;
  categories: MarketplaceCategory[];
  users: User[];
  onSave: (listing: Listing) => void;
  onClose: () => void;
  adminName: string;
}

export const AdminListingEditorModal: React.FC<AdminListingEditorModalProps> = ({
  listing,
  categories,
  users,
  onSave,
  onClose,
  adminName,
}) => {
  const isEditing = !!listing;

  // Form states
  const [title, setTitle] = useState(listing?.title || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [familySlug, setFamilySlug] = useState(listing?.family_slug || 'vehicles');
  const [categorySlug, setCategorySlug] = useState(listing?.category_slug || 'vehicles');
  const [subcategory, setSubcategory] = useState(listing?.category || 'Cars');
  const [price, setPrice] = useState(listing?.price?.toString() || '');
  const [condition, setCondition] = useState<ListingCondition>(listing?.condition || 'Like New');
  const [negotiable, setNegotiable] = useState(listing?.negotiable ?? true);
  const [state, setState] = useState(listing?.location_state || 'Lagos');
  const [lga, setLga] = useState(listing?.location_lga || 'Ikeja');
  const [sellerId, setSellerId] = useState(listing?.user_id || users[0]?.id || 'user-emeka');
  const [sellerPhone, setSellerPhone] = useState(listing?.seller_phone || '+234 803 456 7890');
  const [images, setImages] = useState<string[]>(
    listing?.images?.length ? listing.images : [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Right Column Controls
  const [status, setStatus] = useState<ExtendedListingStatus>(listing?.extended_status || (listing?.status as any) || 'active');
  const [isFeatured, setIsFeatured] = useState(listing?.is_featured ?? false);
  const [isUrgent, setIsUrgent] = useState(listing?.is_urgent ?? false);
  const [adminNotes, setAdminNotes] = useState(listing?.admin_notes || '');
  const [expiryDays, setExpiryDays] = useState('30');

  // Dependent subcategories
  const currentCategoryObj = categories.find(c => c.slug === categorySlug);
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  // Dependent LGAs
  const currentStateObj = NIGERIAN_LOCATIONS.find(l => l.state.toLowerCase() === state.toLowerCase());
  const availableLgas = currentStateObj?.lgas || [];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a listing title.');
      return;
    }
    const numPrice = Number(price) || 0;
    const selectedUser = users.find(u => u.id === sellerId);

    const now = new Date();
    const expiry = new Date(now.getTime() + (Number(expiryDays) || 30) * 24 * 60 * 60 * 1000).toISOString();

    const updatedListing: Listing = {
      id: listing?.id || `lst-${Date.now()}`,
      user_id: sellerId,
      title: title.trim(),
      description: description.trim() || 'Genuine listing verified by AMFFL.',
      family_slug: familySlug,
      category: subcategory || 'General',
      category_slug: categorySlug,
      subcategory: subcategory,
      price: numPrice,
      currency: 'NGN',
      condition,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
      location_state: state,
      location_lga: lga,
      seller_phone: sellerPhone,
      seller_name: selectedUser?.full_name || 'AMFFL Seller',
      seller_verified: selectedUser?.is_verified ?? true,
      seller_tier: selectedUser?.tier_badge || 'Standard',
      negotiable,
      status: status === 'active' ? 'active' : status === 'draft' ? 'draft' : 'inactive',
      extended_status: status,
      is_featured: isFeatured,
      is_urgent: isUrgent,
      admin_notes: adminNotes || undefined,
      reviewed_by: adminName,
      reviewed_at: new Date().toISOString(),
      expires_at: expiry,
      created_date: listing?.created_date || now.toISOString(),
      views_count: listing?.views_count || 12,
      contact_reveals: listing?.contact_reveals || 2,
    };

    onSave(updatedListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                {isEditing ? `Edit Listing: ${listing.title}` : 'Add New Classified Listing'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Authoritative AMFFL Marketplace Listing Editor (Admin Privileges)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-Column WordPress/Classifieds Layout (matches uploaded screenshot) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Listing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2024 Toyota Land Cruiser LC300 VXR, Abuja"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Detailed Description &amp; Specifications
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide thorough specifications, maintenance records, condition notes, and verification credentials..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-normal"
              />
            </div>

            {/* Taxonomy & Hierarchy: Family, Category, Subcategory */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Department &amp; Categories</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Membership Family</label>
                  <select
                    value={familySlug}
                    onChange={(e) => setFamilySlug(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="vehicles">Vehicles</option>
                    <option value="property">Property</option>
                    <option value="others">Others</option>
                    <option value="others-lite">Others Lite</option>
                    <option value="all-in-one">All-in-One</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Top Category</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategorySlug(newCat);
                      const catObj = categories.find(c => c.slug === newCat);
                      if (catObj && catObj.subcategories?.length) {
                        setSubcategory(catObj.subcategories[0]);
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subcategory</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Condition */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>Pricing &amp; Item Condition</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Price (₦ NGN)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 85000000"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ListingCondition)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="New">Brand New</option>
                    <option value="Like New">Like New / Foreign Used</option>
                    <option value="Good">Good / Nigerian Used</option>
                    <option value="Fair">Fair Condition</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isNegotiable"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isNegotiable" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Price Negotiable
                  </label>
                </div>
              </div>
            </div>

            {/* Location (State & LGA) */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nigerian Location Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">State (36 States + FCT)</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      const stateObj = NIGERIAN_LOCATIONS.find(l => l.state.toLowerCase() === newState.toLowerCase());
                      if (stateObj && stateObj.lgas?.length) setLga(stateObj.lgas[0]);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {NIGERIAN_LOCATIONS.map((loc) => (
                      <option key={loc.state} value={loc.state}>{loc.state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Local Government Area (LGA)</label>
                  <select
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {availableLgas.map((lg) => (
                      <option key={lg} value={lg}>{lg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Listing Image URLs (Preview Gallery)
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100">
                    <img src={img} alt={`Ad ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Settings Column (1 Column - Publishing Controls) */}
          <div className="space-y-5">
            {/* Publish Status Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                Publishing &amp; Status Controls
              </h3>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ExtendedListingStatus)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Active (Published on Marketplace)</option>
                  <option value="pending">Pending Review (In Moderation)</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended by Admin</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Seller / Author Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Assign Author / Merchant
                </label>
                <select
                  value={sellerId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSellerId(id);
                    const u = users.find(x => x.id === id);
                    if (u?.phone) setSellerPhone(u.phone);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.tier_badge || 'Standard'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Seller Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Seller Contact Phone
                </label>
                <input
                  type="text"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Visibility & Badges Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Featured Listing Spotlight</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>Urgent Ribbon Badge</span>
                  </div>
                </label>
              </div>

              {/* Expiry Extension */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Listing Expiry Duration
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="15">15 Days</option>
                  <option value="30">30 Days (Standard)</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days (Quarterly)</option>
                  <option value="365">365 Days (Annual Tier)</option>
                </select>
              </div>

              {/* Admin Internal Notes */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes visible only to admin moderators..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isEditing ? 'Update & Save Changes' : 'Publish Listing'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
