import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Hash,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { MarketplaceCategory, CategoryAttribute } from '../../types';

interface AdminCategoriesDeskProps {
  categories: MarketplaceCategory[];
  attributes: CategoryAttribute[];
  onSaveCategory: (cat: MarketplaceCategory) => void;
  onSaveAttribute: (attr: CategoryAttribute) => void;
  onDeleteAttribute: (id: string) => void;
  canPerform: (perm: string) => boolean;
}

export const AdminCategoriesDesk: React.FC<AdminCategoriesDeskProps> = ({
  categories,
  attributes,
  onSaveCategory,
  onSaveAttribute,
  onDeleteAttribute,
  canPerform,
}) => {
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>(categories[0]?.slug || 'vehicles');
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MarketplaceCategory | null>(null);

  // New Subcategory Input
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Attribute Modal State
  const [attrModalOpen, setAttrModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<CategoryAttribute | null>(null);

  // Form states for Category
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [familySlug, setFamilySlug] = useState('others');
  const [iconName, setIconName] = useState('Layers');
  const [accentColor, setAccentColor] = useState('emerald');
  const [sortOrder, setSortOrder] = useState('1');

  // Form states for Attribute
  const [attrName, setAttrName] = useState('');
  const [attrLabel, setAttrLabel] = useState('');
  const [attrType, setAttrType] = useState<CategoryAttribute['type']>('text');
  const [attrOptions, setAttrOptions] = useState('');
  const [attrRequired, setAttrRequired] = useState(false);
  const [attrFilterable, setAttrFilterable] = useState(true);
  const [attrSearchable, setAttrSearchable] = useState(true);

  const currentCategory = categories.find(c => c.slug === selectedCatSlug) || categories[0];
  const currentAttributes = attributes.filter(a => a.category_slug === selectedCatSlug);

  const handleOpenCatModal = (cat?: MarketplaceCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setFamilySlug(cat.family_slug);
      setIconName(cat.icon_name);
      setAccentColor(cat.accent_color);
      setSortOrder(cat.sort_order.toString());
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setFamilySlug('others');
      setIconName('Layers');
      setAccentColor('emerald');
      setSortOrder((categories.length + 1).toString());
    }
    setCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const generatedSlug = catSlug.trim() || catName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated: MarketplaceCategory = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: catName.trim(),
      slug: generatedSlug,
      family_slug: familySlug,
      icon_name: iconName,
      accent_color: accentColor,
      sort_order: Number(sortOrder) || 1,
      is_active: editingCategory ? editingCategory.is_active : true,
      subcategories: editingCategory?.subcategories || [],
      count: editingCategory?.count || 0,
    };

    onSaveCategory(updated);
    setSelectedCatSlug(updated.slug);
    setCatModalOpen(false);
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategoryName.trim() || !currentCategory) return;
    const trimmed = newSubcategoryName.trim();
    if (currentCategory.subcategories.includes(trimmed)) {
      alert('Subcategory already exists.');
      return;
    }

    const updated: MarketplaceCategory = {
      ...currentCategory,
      subcategories: [...currentCategory.subcategories, trimmed],
    };
    onSaveCategory(updated);
    setNewSubcategoryName('');
  };

  const handleRemoveSubcategory = (subName: string) => {
    if (!currentCategory) return;
    if (confirm(`Remove subcategory "${subName}" from ${currentCategory.name}?`)) {
      const updated: MarketplaceCategory = {
        ...currentCategory,
        subcategories: currentCategory.subcategories.filter(s => s !== subName),
      };
      onSaveCategory(updated);
    }
  };

  const handleOpenAttrModal = (attr?: CategoryAttribute) => {
    if (attr) {
      setEditingAttr(attr);
      setAttrName(attr.name);
      setAttrLabel(attr.label);
      setAttrType(attr.type);
      setAttrOptions((attr.options || []).join(', '));
      setAttrRequired(attr.required);
      setAttrFilterable(attr.is_filterable);
      setAttrSearchable(attr.is_searchable);
    } else {
      setEditingAttr(null);
      setAttrName('');
      setAttrLabel('');
      setAttrType('text');
      setAttrOptions('');
      setAttrRequired(false);
      setAttrFilterable(true);
      setAttrSearchable(true);
    }
    setAttrModalOpen(true);
  };

  const handleSaveAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrName.trim() || !attrLabel.trim()) return;

    const optionsArray = attrOptions.split(',').map(s => s.trim()).filter(Boolean);

    const updatedAttr: CategoryAttribute = {
      id: editingAttr?.id || `attr-${Date.now()}`,
      category_slug: selectedCatSlug,
      name: attrName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      label: attrLabel.trim(),
      type: attrType,
      options: optionsArray.length > 0 ? optionsArray : undefined,
      required: attrRequired,
      is_filterable: attrFilterable,
      is_searchable: attrSearchable,
      sort_order: editingAttr?.sort_order || (currentAttributes.length + 1),
    };

    onSaveAttribute(updatedAttr);
    setAttrModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Categories &amp; Subcategories Management
          </h2>
          <p className="text-xs text-slate-500">
            Define marketplace taxonomy, department hierarchy, and structured attributes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCatModal()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2-Column Taxonomy Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Categories List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
            Categories ({categories.length})
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = cat.slug === selectedCatSlug;
              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  onClick={() => setSelectedCatSlug(cat.slug)}
                >
                  <div className="flex items-center gap-2 truncate text-xs">
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                      {cat.subcategories.length}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCatModal(cat);
                      }}
                      className="p-1 hover:text-emerald-700 text-slate-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Category Subcategories & Custom Attributes (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {currentCategory ? (
            <>
              {/* Category Overview Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Family: {currentCategory.family_slug}
                    </span>
                    <span className="text-xs text-slate-400">Slug: /{currentCategory.slug}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                    {currentCategory.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...currentCategory, is_active: !currentCategory.is_active };
                      onSaveCategory(updated);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      currentCategory.is_active
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {currentCategory.is_active ? 'Active (Live)' : 'Deactivated'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCatModal(currentCategory)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Edit Details
                  </button>
                </div>
              </div>

              {/* Subcategories Management */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                    Configured Subcategories ({currentCategory.subcategories.length})
                  </h3>
                </div>

                {/* Add Subcategory Form */}
                <form onSubmit={handleAddSubcategory} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Enter new subcategory name..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>

                {/* Subcategory Pills Grid */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentCategory.subcategories.map((sub) => (
                    <div
                      key={sub}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium group"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategory(sub)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Attributes Desk */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                      <span>Custom Attributes for {currentCategory.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fields shown on ad creation and filter toolbars (e.g. Make, Model, Year, Bedrooms)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAttrModal()}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Attribute</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {currentAttributes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No custom attributes defined for this category yet. Click &quot;+ Add Attribute&quot; to configure fields like Brand, Fuel Type, Year, etc.
                    </div>
                  ) : (
                    currentAttributes.map((attr) => (
                      <div key={attr.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{attr.label}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Field: {attr.name} • Type: <span className="text-emerald-700 uppercase">{attr.type}</span>
                            {attr.options && ` • Options: (${attr.options.length})`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {attr.required && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Required
                            </span>
                          )}
                          {attr.is_filterable && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              Filterable
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenAttrModal(attr)}
                            className="p-1.5 text-slate-500 hover:text-slate-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete attribute "${attr.label}"?`)) onDeleteAttribute(attr.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              Select a category to view and edit details.
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Solar & Renewable Energy"
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. solar-renewable-energy"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Membership Family</label>
                <select
                  value={familySlug}
                  onChange={(e) => setFamilySlug(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="vehicles">Vehicles</option>
                  <option value="property">Property</option>
                  <option value="others">Others</option>
                  <option value="others-lite">Others Lite</option>
                  <option value="all-in-one">All-in-One</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attribute Modal */}
      {attrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              {editingAttr ? 'Edit Custom Attribute' : 'Add Custom Attribute'}
            </h3>
            <form onSubmit={handleSaveAttribute} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Label (Display Name)</label>
                  <input
                    type="text"
                    value={attrLabel}
                    onChange={(e) => setAttrLabel(e.target.value)}
                    placeholder="e.g. Engine Capacity (cc)"
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Field Key</label>
                  <input
                    type="text"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    placeholder="e.g. engine_capacity"
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Input Field Type</label>
                <select
                  value={attrType}
                  onChange={(e) => setAttrType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                >
                  <option value="text">Text Input</option>
                  <option value="number">Number Input</option>
                  <option value="dropdown">Dropdown Select</option>
                  <option value="multi_select">Multi-Select Checkboxes</option>
                  <option value="boolean">Boolean Switch (Yes/No)</option>
                </select>
              </div>

              {(attrType === 'dropdown' || attrType === 'multi_select') && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={attrOptions}
                    onChange={(e) => setAttrOptions(e.target.value)}
                    placeholder="e.g. Petrol, Diesel, Hybrid, Electric"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attrRequired}
                    onChange={(e) => setAttrRequired(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Mandatory on ad submission</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attrFilterable}
                    onChange={(e) => setAttrFilterable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Available in filter bar</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAttrModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
