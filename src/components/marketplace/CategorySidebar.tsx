import React, { useState } from 'react';
import { 
  Laptop, 
  Cog, 
  Baby, 
  Hammer, 
  Building2, 
  Car, 
  Sparkles, 
  Armchair, 
  Gamepad2, 
  Shirt, 
  Dog, 
  Wheat, 
  Smartphone, 
  Briefcase, 
  UserCheck, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { MarketplaceCategory } from '../../types';

interface CategorySidebarProps {
  categories: MarketplaceCategory[];
  selectedCategorySlug?: string;
  selectedSubcategory?: string;
  categoryCounts: Record<string, number>;
  onSelectCategory: (categorySlug: string, subcategory?: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Laptop': <Laptop className="w-4 h-4" />,
  'Cog': <Cog className="w-4 h-4" />,
  'Baby': <Baby className="w-4 h-4" />,
  'Hammer': <Hammer className="w-4 h-4" />,
  'Building2': <Building2 className="w-4 h-4" />,
  'Car': <Car className="w-4 h-4" />,
  'Sparkles': <Sparkles className="w-4 h-4" />,
  'Armchair': <Armchair className="w-4 h-4" />,
  'Gamepad2': <Gamepad2 className="w-4 h-4" />,
  'Shirt': <Shirt className="w-4 h-4" />,
  'Dog': <Dog className="w-4 h-4" />,
  'Wheat': <Wheat className="w-4 h-4" />,
  'Smartphone': <Smartphone className="w-4 h-4" />,
  'Briefcase': <Briefcase className="w-4 h-4" />,
  'UserCheck': <UserCheck className="w-4 h-4" />,
};

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategorySlug,
  selectedSubcategory,
  categoryCounts,
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<MarketplaceCategory | null>(null);

  const totalAllCount = categories.reduce((sum, cat) => sum + (categoryCounts[cat.slug] || cat.count || 0), 0);

  return (
    <aside className="relative z-30 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
      {/* Header */}
      <div 
        onClick={() => onSelectCategory('all')}
        className={`p-3.5 border-b border-slate-200 flex items-center justify-between cursor-pointer rounded-t-2xl transition-colors ${
          !selectedCategorySlug || selectedCategorySlug === 'all'
            ? 'bg-emerald-50 text-emerald-900 font-bold'
            : 'bg-slate-50/80 hover:bg-slate-100 text-slate-900 font-bold'
        }`}
      >
        <div className="flex items-center gap-2 text-xs">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>All Categories</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
          {totalAllCount.toLocaleString()}
        </span>
      </div>

      {/* Category List */}
      <div className="py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          const isHovered = hoveredCategory?.id === cat.id;
          const count = categoryCounts[cat.slug] !== undefined ? categoryCounts[cat.slug] : (cat.count || 0);
          const icon = ICON_MAP[cat.icon_name] || <Layers className="w-4 h-4" />;

          return (
            <div
              key={cat.id}
              className={`relative ${isHovered ? 'z-50' : 'z-10'}`}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`${isSelected ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                    {icon}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-600">
                    {count}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Flyout Subcategories Menu (Desktop Hover with bridge) */}
              {isHovered && cat.subcategories && cat.subcategories.length > 0 && (
                <div 
                  className="hidden lg:block absolute left-full top-0 -ml-1 pl-3 w-72 z-50 pointer-events-auto"
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 ring-1 ring-black/5 animate-in fade-in slide-in-from-left-2 duration-150">
                    <div className="pb-2.5 mb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600">{icon}</span>
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{cat.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectCategory(cat.slug)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        All in {cat.name} →
                      </button>
                    </div>

                    <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                      {cat.subcategories.map((sub) => {
                        const isSubSelected = selectedSubcategory === sub;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => onSelectCategory(cat.slug, sub)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                              isSubSelected
                                ? 'bg-emerald-100 text-emerald-900 font-bold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                            }`}
                          >
                            <span className="truncate">{sub}</span>
                            {isSubSelected && <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
