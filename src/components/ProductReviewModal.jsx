import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const RATING_LABELS = {
  1: 'Poor Quality',
  2: 'Below Average',
  3: 'Good Quality',
  4: 'Very Good Quality',
  5: 'Superior Wholesale Quality ⭐',
};

export default function ProductReviewModal() {
  const { reviewModalData, setReviewModalData, submitProductReview, currentUser } = useStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!reviewModalData) return null;

  const product = reviewModalData.product;
  const orderId = reviewModalData.orderId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitProductReview({
        productId: product.id,
        rating,
        reviewText: reviewText.trim(),
        reviewerName: reviewerName.trim() || currentUser?.name || 'Verified Customer',
        reviewerPhone: currentUser?.phone || '',
        orderId: orderId || null,
      });
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReviewModalData(null);
    setIsSuccess(false);
    setError('');
    setReviewText('');
    setRating(5);
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#154d28] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Rate & Review Product</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Help other wholesale buyers make decisions</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Snippet */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <img
            src={product.images?.[0] || product.image}
            alt={product.title}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0 bg-white"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
              <span>₹{product.price} wholesale</span>
              <span>•</span>
              <span className="text-[#154d28] font-bold">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-5 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Review Submitted!</h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Thank you for rating this product. Your feedback helps wholesale grocers across Visakhapatnam get authentic quality ratings.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full py-2.5 bg-[#154d28] hover:bg-[#113e20] text-white font-bold text-sm rounded-xl transition shadow-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="text-center py-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = starValue <= activeRating;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-amber-700 mt-2 h-4">
                  {RATING_LABELS[activeRating]}
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name / Business Name
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Sri Balaji Traders"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154d28] focus:border-[#154d28]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Review & Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the grain quality, packaging, freshness, or wholesale value..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154d28] focus:border-[#154d28] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#154d28] hover:bg-[#113e20] active:bg-[#0c2f17] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Review...' : 'Submit Rating & Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
