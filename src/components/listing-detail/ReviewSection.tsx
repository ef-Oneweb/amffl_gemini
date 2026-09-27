import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react';
import { Review, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface ReviewSectionProps {
  sellerId: string;
  sellerName?: string;
  listingId?: string;
  listingTitle?: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  sellerId,
  sellerName = 'Seller',
  listingId,
  listingTitle,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(() => {
    return StorageService.getReviews().filter(
      r => r.seller_id === sellerId && r.status === 'published'
    );
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Checks
  const isOwner = user?.id === sellerId;
  const alreadyReviewed = user 
    ? StorageService.getReviews().some(r => r.seller_id === sellerId && r.reviewer_id === user.id)
    : false;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (isOwner) {
      setErrorMsg('You cannot review your own profile or listings.');
      return;
    }
    if (alreadyReviewed) {
      setErrorMsg('You have already submitted a review for this seller.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Please write a brief comment describing your transaction.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      reviewer_id: user.id,
      reviewer_name: user.full_name || 'Verified Buyer',
      seller_id: sellerId,
      listing_id: listingId,
      listing_title: listingTitle,
      rating,
      comment: comment.trim(),
      status: 'published', // Published by default for immediate feedback
      created_date: new Date().toISOString(),
    };

    StorageService.saveReview(newReview);
    setReviews([newReview, ...reviews]);
    setComment('');
    setSubmittedMsg('Thank you! Your feedback has been published.');
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Seller Reviews & Trust Rating
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified feedback from buyers who interacted with {sellerName}
          </p>
        </div>

        {averageRating && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-lg">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{averageRating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <span className="text-[11px] text-slate-400">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      {isAuthenticated && !isOwner && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-slate-900">Rate Your Experience with this Seller</p>

          {/* Star selector */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-slate-700 ml-2">
              {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Poor'}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about product condition, responsiveness, or delivery..."
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {errorMsg && (
            <div className="text-xs text-red-600 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" /> {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            {submitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      )}

      {submittedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submittedMsg}</span>
        </div>
      )}

      {isOwner && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-500 text-center">
          You are the owner of this seller profile.
        </div>
      )}

      {alreadyReviewed && !submittedMsg && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>You have already submitted a review for this merchant.</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4 divide-y divide-slate-100">
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No reviews yet. Be the first to review this verified seller!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{rev.reviewer_name}</span>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rev.created_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
