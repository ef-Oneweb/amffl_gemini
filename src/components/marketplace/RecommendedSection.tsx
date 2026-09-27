import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Listing } from '../../types';
import { ListingCard } from './ListingCard';

interface RecommendedSectionProps {
  listings: Listing[];
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ listings }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (listings.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="w-4 h-4 fill-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Recommended for you
            </h2>
            <p className="text-[11px] text-slate-500">
              Curated top-ranked items from verified members across Nigeria
            </p>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
      >
        {listings.map((item) => (
          <div key={item.id} className="w-56 sm:w-64 shrink-0">
            <ListingCard listing={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
