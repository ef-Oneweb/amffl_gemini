import React from 'react';
import { FilterState, ListingCondition } from '../../types';
import { NIGERIAN_LOCATIONS } from '../../data/seedData';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterToolbarProps {
  filter: FilterState;
  onChangeFilter: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filter,
  onChangeFilter,
  onResetFilters,
  totalResults,
}) => {
  const selectedStateObj = NIGERIAN_LOCATIONS.find(
    l => l.state.toLowerCase() === (filter.state || '').toLowerCase()
  );
  const availableLgas = selectedStateObj ? selectedStateObj.lgas : [];

  const hasActiveFilters = !!(
    (filter.state && filter.state !== 'all') ||
    (filter.lga && filter.lga !== 'all') ||
    (filter.condition && filter.condition !== 'all') ||
    filter.q ||
    filter.min_price ||
    filter.max_price ||
    (filter.sort && filter.sort !== 'recommended')
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 mb-6">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Filters & Sorting
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {totalResults} listings found
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        )}
      </div>

      {/* Dropdown Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* State */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            State
          </label>
          <select
            value={filter.state || 'all'}
            onChange={(e) => {
              const newState = e.target.value;
              onChangeFilter({ state: newState === 'all' ? undefined : newState, lga: undefined });
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Nigeria (36 States)</option>
            {NIGERIAN_LOCATIONS.map((loc) => (
              <option key={loc.state} value={loc.state}>
                {loc.state}
              </option>
            ))}
          </select>
        </div>

        {/* Dependent LGA */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            LGA {selectedStateObj ? `(${selectedStateObj.state})` : ''}
          </label>
          <select
            value={filter.lga || 'all'}
            disabled={!selectedStateObj}
            onChange={(e) => {
              const newLga = e.target.value;
              onChangeFilter({ lga: newLga === 'all' ? undefined : newLga });
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <option value="all">{selectedStateObj ? 'All LGAs' : 'Select State first'}</option>
            {availableLgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Condition
          </label>
          <select
            value={filter.condition || 'all'}
            onChange={(e) => {
              const val = e.target.value;
              onChangeFilter({ condition: val === 'all' ? undefined : (val as ListingCondition) });
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Any Condition</option>
            <option value="New">Brand New</option>
            <option value="Like New">Like New / Foreign Used</option>
            <option value="Good">Good / Nigerian Used</option>
            <option value="Fair">Fair Condition</option>
            <option value="Refurbished">Refurbished</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filter.sort || 'recommended'}
            onChange={(e) => onChangeFilter({ sort: e.target.value as any })}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="recommended">Recommended (Ranked)</option>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Price Range Slider / Quick Presets */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span>Price Filter (₦):</span>
          <input
            type="number"
            placeholder="Min ₦"
            value={filter.min_price || ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              onChangeFilter({ min_price: val });
            }}
            className="w-24 sm:w-28 px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max ₦"
            value={filter.max_price || ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              onChangeFilter({ max_price: val });
            }}
            className="w-28 sm:w-36 px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 font-medium">Under:</span>
          {[100000, 1000000, 5000000, 20000000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onChangeFilter({ min_price: undefined, max_price: amt })}
              className={`px-2 py-0.5 rounded-full border transition-colors ${
                filter.max_price === amt
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              &lt; ₦{(amt / 1000).toLocaleString()}k
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
