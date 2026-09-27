import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketplaceHero } from '../components/marketplace/MarketplaceHero';
import { CategorySidebar } from '../components/marketplace/CategorySidebar';
import { FilterToolbar } from '../components/marketplace/FilterToolbar';
import { ListingCard } from '../components/marketplace/ListingCard';
import { RecommendedSection } from '../components/marketplace/RecommendedSection';
import { StorageService } from '../services/storageService';
import { MarketplaceService, BrowseResult } from '../services/marketplaceService';
import { FilterState, Listing, MarketplaceCategory } from '../types';
import { PackageSearch, Loader2, ArrowDown, Layers, X, ChevronRight } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // State
  const [categories, setCategories] = useState<MarketplaceCategory[]>(() =>
    StorageService.getCategories()
  );

  const [filter, setFilter] = useState<FilterState>({
    category_slug: searchParams.get('category') || undefined,
    state: searchParams.get('state') || undefined,
    q: searchParams.get('q') || undefined,
    sort: 'recommended',
  });

  const [offset, setOffset] = useState(0);
  const [limit] = useState(16);
  const [browseData, setBrowseData] = useState<BrowseResult>(() =>
    MarketplaceService.browse(filter, 0, 16)
  );

  // Recommended strip
  const [recommended, setRecommended] = useState<Listing[]>(() =>
    MarketplaceService.getRecommendedListings(8)
  );

  const refreshData = () => {
    setCategories(StorageService.getCategories());
    setBrowseData(MarketplaceService.browse(filter, 0, offset + limit));
    setRecommended(MarketplaceService.getRecommendedListings(8));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('amffl_store_update', handleUpdate);
    return () => window.removeEventListener('amffl_store_update', handleUpdate);
  }, [filter, offset]);

  // Handle hero search
  const handleHeroSearch = (params: { q?: string; state?: string; category_slug?: string }) => {
    setFilter(prev => ({
      ...prev,
      q: params.q,
      state: params.state,
      category_slug: params.category_slug,
    }));
    setOffset(0);
  };

  const handleSelectCategory = (slug: string, subcategory?: string) => {
    setFilter(prev => ({
      ...prev,
      category_slug: slug === 'all' ? undefined : slug,
      category: subcategory || undefined,
    }));
    setOffset(0);
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...updates }));
    setOffset(0);
  };

  const handleResetFilters = () => {
    setFilter({ sort: 'recommended' });
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner with Jiji-style search bar */}
      <MarketplaceHero
        categories={categories}
        onSearch={handleHeroSearch}
        selectedState={filter.state}
        selectedCategorySlug={filter.category_slug}
      />

      {/* Mobile Categories Quick Bar */}
      <div className="lg:hidden mb-5">
        <button
          type="button"
          onClick={() => setMobileCategoriesOpen(true)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs text-xs font-bold text-slate-800 hover:border-emerald-500 transition-colors"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left truncate">
              <div className="text-slate-900 font-extrabold truncate">
                {filter.category_slug 
                  ? `${categories.find(c => c.slug === filter.category_slug)?.name || filter.category_slug}`
                  : 'Browse Categories & Subcategories'}
              </div>
              <div className="text-[10px] text-slate-500 font-normal">
                {filter.category ? `Subcategory: ${filter.category}` : 'Tap to expand all departments'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Main 2-Column Marketplace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Category Sidebar with elevated stacking context */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20 z-30">
          <CategorySidebar
            categories={categories}
            selectedCategorySlug={filter.category_slug}
            selectedSubcategory={filter.category}
            categoryCounts={browseData.categoryCounts}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Right Column: Listings & Filters */}
        <div className="lg:col-span-3 space-y-6 relative z-10">
          {/* Filter Toolbar (State, LGA, Condition, Sort, Price) */}
          <FilterToolbar
            filter={filter}
            onChangeFilter={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={browseData.total}
          />

          {/* Recommended Section (Horizontal Carousel) */}
          {(!filter.q && !filter.category_slug) && (
            <RecommendedSection listings={recommended} />
          )}

          {/* Latest Posted Ads Grid Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Latest Posted Ads{' '}
              <span className="text-xs text-slate-500 font-normal">
                ({browseData.total} listings)
              </span>
            </h2>
          </div>

          {/* Listings Grid */}
          {browseData.listings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-extrabold text-base text-slate-800 font-['Plus_Jakarta_Sans']">
                No listings found matching your criteria
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing state filters, or searching with broader keywords.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {browseData.listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {browseData.hasMore && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200 shadow-sm transition-all inline-flex items-center gap-2 hover:border-slate-300 active:scale-95"
              >
                <span>Load More Ads</span>
                <ArrowDown className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Categories Slide-Over Modal */}
      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileCategoriesOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Categories & Subcategories</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleSelectCategory('all');
                  setMobileCategoriesOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-colors ${
                  !filter.category_slug || filter.category_slug === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Categories (View Everything)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {categories.map((cat) => {
                const isSelected = filter.category_slug === cat.slug;
                const isExpanded = expandedMobileCategory === cat.slug;
                const count = browseData.categoryCounts[cat.slug] !== undefined 
                  ? browseData.categoryCounts[cat.slug] 
                  : (cat.count || 0);

                return (
                  <div key={cat.id} className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCategory(cat.slug);
                          setMobileCategoriesOpen(false);
                        }}
                        className="flex-1 text-left text-xs font-bold text-slate-800 flex items-center justify-between pr-2"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      </button>

                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.slug)}
                          className="p-1 text-slate-400 hover:text-emerald-600"
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90 text-emerald-600' : ''}`} />
                        </button>
                      )}
                    </div>

                    {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="bg-slate-50/80 p-2 space-y-1 border-t border-slate-100 pl-4">
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectCategory(cat.slug);
                            setMobileCategoriesOpen(false);
                          }}
                          className="w-full text-left py-1 text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          All in {cat.name} →
                        </button>
                        {cat.subcategories.map((sub) => {
                          const isSubSelected = filter.category === sub;
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                handleSelectCategory(cat.slug, sub);
                                setMobileCategoriesOpen(false);
                              }}
                              className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                isSubSelected
                                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <span>{sub}</span>
                              {isSubSelected && <ChevronRight className="w-3 h-3 text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
