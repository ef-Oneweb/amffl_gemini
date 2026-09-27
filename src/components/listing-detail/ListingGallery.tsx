import React, { useState } from 'react';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export const ListingGallery: React.FC<ListingGalleryProps> = ({ images, title }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const fallbackImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  const displayImages = images.length > 0 ? images : [fallbackImage];

  return (
    <div className="space-y-3">
      {/* Primary Main Image */}
      <div className="relative aspect-4/3 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <img
          src={displayImages[activeIdx] || fallbackImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
          {activeIdx + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIdx === idx
                  ? 'border-emerald-600 scale-95 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
