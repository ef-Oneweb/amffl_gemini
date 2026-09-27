import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload, 
  X, 
  Check, 
  ShieldAlert, 
  Crown, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Phone, 
  Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { MembershipService } from '../services/membershipService';
import { Listing, ListingCondition, MarketplaceCategory, MembershipFamily } from '../types';
import { NIGERIAN_LOCATIONS } from '../data/seedData';

export const CreateListingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const families = StorageService.getFamilies();
  const categories = StorageService.getCategories();

  // Active subscription check
  const activeSub = user ? StorageService.getUserActiveSubscription(user.id) : undefined;
  const activePlan = activeSub ? StorageService.getPlans().find(p => p.id === activeSub.plan_id) : undefined;

  // Form states
  const [familySlug, setFamilySlug] = useState('vehicles');
  const [categorySlug, setCategorySlug] = useState('vehicles');
  const [subcategory, setSubcategory] = useState('Cars');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [negotiable, setNegotiable] = useState(true);
  const [condition, setCondition] = useState<ListingCondition>('New');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [phone, setPhone] = useState(user?.phone || '+234 802 345 6789');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Available categories for selected family
  const filteredCategories = categories.filter(c => c.family_slug === familySlug || familySlug === 'all-in-one');
  const selectedCatObj = categories.find(c => c.slug === categorySlug);
  const availableSubcategories = selectedCatObj?.subcategories || ['General'];

  // State LGAs
  const selectedStateObj = NIGERIAN_LOCATIONS.find(l => l.state === state);
  const availableLgas = selectedStateObj?.lgas || [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?returnTo=/sell');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedCatObj && selectedCatObj.subcategories.length > 0) {
      setSubcategory(selectedCatObj.subcategories[0]);
    }
  }, [categorySlug]);

  useEffect(() => {
    if (availableLgas.length > 0) {
      setLga(availableLgas[0]);
    }
  }, [state]);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setQuotaError(null);

    // Business Logic Quota Validation from Spec §7:
    const quotaCheck = MembershipService.checkListingQuota(
      user.id,
      subcategory || selectedCatObj?.name || 'General',
      familySlug,
      isFeatured
    );

    if (!quotaCheck.allowed) {
      setQuotaError(quotaCheck.reason || 'Listing limit reached for your active membership tier.');
      return;
    }

    setSubmitting(true);

    const newListing: Listing = {
      id: `list_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      family_slug: familySlug,
      category: selectedCatObj?.name || 'General',
      category_slug: categorySlug,
      subcategory: subcategory,
      price: Number(price) || 0,
      currency: 'NGN',
      condition,
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
      ],
      location_state: state,
      location_lga: lga,
      seller_phone: phone,
      seller_name: user.full_name,
      seller_verified: user.is_verified,
      seller_tier: activePlan?.name,
      negotiable,
      plan_id: activeSub?.plan_id,
      status: 'active',
      is_featured: isFeatured,
      promotion_type: isFeatured ? 'featured' : undefined,
      promotion_score_boost: isFeatured ? 120 : 0,
      created_date: new Date().toISOString(),
      views_count: 1,
      contact_reveals: 0,
    };

    StorageService.saveListing(newListing);
    setSubmitting(false);
    navigate(`/marketplace/${newListing.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          Post Your Ad on AMFFL
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reach thousands of verified buyers across all 36 Nigerian states
        </p>
      </div>

      {/* Membership Quota Banner */}
      {activePlan ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-emerald-950">
                  Active Plan: {activePlan.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-bold">
                  {activePlan.visibility_multiplier} Boost
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Posting quota active for {activeSub?.family_slug} category inventory.
              </p>
            </div>
          </div>

          <Link
            to="/premium-services"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline shrink-0"
          >
            Manage Quota
          </Link>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-amber-950 font-['Plus_Jakarta_Sans']">
                Active Membership Plan Required
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                As per AMFFL marketplace regulations, sellers require an active membership plan (or Free tier activation) to post listings.
              </p>
            </div>
          </div>

          <Link
            to="/premium-services"
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shrink-0 text-center"
          >
            Activate Plan Now
          </Link>
        </div>
      )}

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {quotaError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-bold">Quota Check Failed</p>
              <p className="mt-0.5">{quotaError}</p>
            </div>
          </div>
        )}

        {/* Family & Category Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Membership Family *
            </label>
            <select
              value={familySlug}
              onChange={(e) => setFamilySlug(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {families.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {filteredCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Subcategory *
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Ad Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. VALTRA A950 4WD Farm Tractor or 2023 Toyota Prado TX-L"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Detailed Description *
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the condition, technical specifications, origin (Nigerian used/Foreign used), engine capacity, warranty, etc."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          />
        </div>

        {/* Price & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Price (₦ NGN) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 2500000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ListingCondition)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="New">Brand New</option>
              <option value="Like New">Like New / Foreign Used</option>
              <option value="Good">Good / Nigerian Used</option>
              <option value="Fair">Fair Condition</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Price Negotiable</span>
            </label>
          </div>
        </div>

        {/* Location & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              State *
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {NIGERIAN_LOCATIONS.map((loc) => (
                <option key={loc.state} value={loc.state}>
                  {loc.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              LGA *
            </label>
            <select
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableLgas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Seller Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Listing Photos ({images.length})
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste public image URL or use sample presets..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
            >
              Add URL
            </button>
          </div>

          {/* Preset image suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span>Quick Presets:</span>
            <button
              type="button"
              onClick={() => setImages([...images, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'])}
              className="text-emerald-700 underline font-semibold"
            >
              + Farm Tractor
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setImages([...images, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'])}
              className="text-emerald-700 underline font-semibold"
            >
              + Toyota SUV
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setImages([...images, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'])}
              className="text-emerald-700 underline font-semibold"
            >
              + Lekki Duplex
            </button>
          </div>

          {/* Previews Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-80 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Boost Checkbox */}
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
          <input
            type="checkbox"
            id="featured-checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="featured-checkbox" className="text-xs text-purple-950 cursor-pointer">
            <div className="flex items-center gap-1.5 font-extrabold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
              <span>Apply Featured Ad Boost Immediately</span>
            </div>
            <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
              Consumes 1 featured ad slot from your active membership plan to grant +120 priority ranking score.
            </p>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
