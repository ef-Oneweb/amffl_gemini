import React, { useState } from 'react';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { StorageService } from '../../services/storageService';

export const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());

  const refresh = () => setReviews(StorageService.getReviews());

  const handleUpdateStatus = (id: string, status: 'published' | 'hidden') => {
    StorageService.updateReviewStatus(id, status);
    refresh();
  };

  const handleDelete = (id: string) => {
    const list = reviews.filter(r => r.id !== id);
    localStorage.setItem('amffl_reviews', JSON.stringify(list));
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
          Member Reviews &amp; Feedback Moderation ({reviews.length})
        </h3>
        <p className="text-xs text-slate-500">Publish, hide or remove reviews impacting seller trust scores</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Reviewer</th>
              <th className="py-2.5 px-3">Seller ID / Listing</th>
              <th className="py-2.5 px-3">Rating</th>
              <th className="py-2.5 px-3">Comment</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-3 font-bold text-slate-900">{rev.reviewer_name}</td>
                <td className="py-3 px-3 text-slate-600">
                  <span className="font-mono text-[11px] block">{rev.seller_id}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                    {rev.listing_title || 'Direct seller review'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xs ml-1">{rev.rating}/5</span>
                  </div>
                </td>
                <td className="py-3 px-3 max-w-xs truncate text-slate-600">
                  {rev.comment}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1.5">
                  {rev.status !== 'published' ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev.id, 'published')}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="Publish"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev.id, 'hidden')}
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                      title="Hide"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
