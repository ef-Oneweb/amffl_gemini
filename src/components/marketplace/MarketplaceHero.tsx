import React, { useState } from 'react';
import { Search, MapPin, Grid, Sparkles } from 'lucide-react';
import { NIGERIAN_LOCATIONS } from '../../data/seedData';
import { MarketplaceCategory } from '../../types';

interface MarketplaceHeroProps {
  categories: MarketplaceCategory[];
  onSearch: (params: { q?: string; state?: string; category_slug?: string }) => void;
  selectedState?: string;
  selectedCategorySlug?: string;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  categories,
  onSearch,
  selectedState = 'all',
  selectedCategorySlug = 'all',
}) => {
  const [keyword, setKeyword] = useState('');
  const [state, setState] = useState(selectedState);
  const [catSlug, setCatSlug] = useState(selectedCategorySlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      q: keyword.trim() || undefined,
      state: state === 'all' ? undefined : state,
      category_slug: catSlug === 'all' ? undefined : catSlug,
    });
  };

  const handleQuickTag = (tag: string) => {
    setKeyword(tag);
    onSearch({
      q: tag,
      state: state === 'all' ? undefined : state,
      category_slug: catSlug === 'all' ? undefined : catSlug,
    });
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c5c36] via-[#11693e] to-[#084226] text-white shadow-xl mb-8 p-6 sm:p-10 border border-emerald-700/50">
      {/* Decorative ambient background rings */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-yellow-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Nigeria&apos;s Verified Commerce Network</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm font-['Plus_Jakarta_Sans']">
          Buy and sell across Nigeria
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          Browse thousands of listings from verified AMFFL members — vehicles, commercial equipment, real estate, electronics, and agriculture.
        </p>

        {/* Jiji-Style Unified Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
        >
          {/* State Dropdown */}
          <div className="w-full sm:w-44 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              <option value="all">All Nigeria</option>
              {NIGERIAN_LOCATIONS.map((loc) => (
                <option key={loc.state} value={loc.state}>
                  {loc.state}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-48 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 text-slate-700">
            <Grid className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="w-full flex-1 flex items-center gap-2 px-3 py-2 text-slate-700">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword e.g. Tractor, Palm Oil, Prado, iPhone..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick popular search tags */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-emerald-200">
          <span className="font-semibold text-emerald-300">Trending:</span>
          {['Tractors', 'Palm Oil Press', 'Toyota Prado', 'Lekki Duplex', 'Solar Inverter', 'Fertilizer'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTag(tag)}
              className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
