import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderPlus, Check } from 'lucide-react';
import { MarketplaceCategory, MembershipFamily } from '../../types';
import { StorageService } from '../../services/storageService';

export const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<MarketplaceCategory[]>(() => StorageService.getCategories());
  const [families] = useState<MembershipFamily[]>(() => StorageService.getFamilies());
  const [showAddModal, setShowAddModal] = useState(false);

  // New category form state
  const [name, setName] = useState('');
  const [familySlug, setFamilySlug] = useState('others');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [iconName, setIconName] = useState('Layers');

  const refresh = () => setCategories(StorageService.getCategories());

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const subs = subcategoriesText.split('\n').map(s => s.trim()).filter(Boolean);

    const newCat: MarketplaceCategory = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      slug,
      family_slug: familySlug,
      subcategories: subs,
      icon_name: iconName,
      accent_color: '#16a34a',
      sort_order: categories.length + 1,
      is_active: true,
      count: 0,
    };

    StorageService.saveCategory(newCat);
    refresh();
    setShowAddModal(false);
    setName('');
    setSubcategoriesText('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      localStorage.setItem('amffl_categories', JSON.stringify(updated));
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
            Catalog Categories &amp; Taxonomy ({categories.length})
          </h3>
          <p className="text-xs text-slate-500">Marketplace hierarchy linked to membership family quotas</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Family: {cat.family_slug}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
                  {cat.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400">slug: {cat.slug}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Subcategories pills */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                Subcategories ({cat.subcategories?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {cat.subcategories?.slice(0, 6).map((sub, i) => (
                  <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                    {sub}
                  </span>
                ))}
                {(cat.subcategories?.length || 0) > 6 && (
                  <span className="text-[10px] text-slate-400 px-1 py-0.5">
                    +{cat.subcategories.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Add Marketplace Category
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Industrial Generators"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Membership Family</label>
                <select
                  value={familySlug}
                  onChange={(e) => setFamilySlug(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                >
                  {families.map((f) => (
                    <option key={f.slug} value={f.slug}>
                      {f.name} ({f.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subcategories (One per line)
                </label>
                <textarea
                  rows={4}
                  value={subcategoriesText}
                  onChange={(e) => setSubcategoriesText(e.target.value)}
                  placeholder="Diesel Generators&#10;Petrol Generators&#10;Soundproof Plants"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
