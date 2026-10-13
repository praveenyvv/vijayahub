import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Star,
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Phone,
  ThumbsUp,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FEEDBACK_TYPES = [
  { id: 'review', label: '⭐ Store Review / Rating' },
  { id: 'complaint', label: '⚠️ Issue / Complaint' },
  { id: 'order_help', label: '📦 Pickup / Order Assistance' },
  { id: 'suggestion', label: '💡 Product Suggestion' }
];

export default function FeedbackSupportModal({ isOpen, onClose }) {
  const { currentUser, submitFeedback, storeInfo } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [type, setType] = useState('review');
  const [rating, setRating] = useState(5);
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !name) setName(currentUser.name);
      if (currentUser.phone && !phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setMessage('');
    setOrderId('');
    if (window.history.state?.modal === 'feedback-modal') {
      window.history.back();
    } else {
      onClose();
    }
  };

  // Handle hardware / gesture browser back button
  React.useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: 'feedback-modal' }, '');
      const handlePopState = () => {
        handleResetAndClose();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen]);

  // Handle Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number so we can contact you.');
      return;
    }
    if (!message.trim()) {
      alert('Please write your message or complaint details.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        customerName: name,
        customerPhone: phone,
        type,
        rating,
        orderId: orderId.trim() || null,
        message: message.trim()
      });
      setSubmittedSuccess(true);
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={handleResetAndClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Customer Support & Feedback
              </h3>
              <p className="text-xs text-slate-300">
                Help us improve or report an issue with your pickup order
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your response has been logged directly with our Dwaraka Nagar Hub store management team. If this was a complaint or order issue, we will reach out to <strong>{phone}</strong> promptly.
                </p>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Need Urgent Store Assistance?
                </p>
                <p className="text-[11px] text-slate-500">
                  Call or WhatsApp our central hub helpline directly at{' '}
                  <strong className="text-slate-900">{storeInfo.phone}</strong> (10 AM - 8:30 PM).
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition shadow-sm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  What is this regarding?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        type === t.id
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Star selector if review */}
              {type === 'review' && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 text-center space-y-1.5">
                  <span className="text-xs font-extrabold text-amber-900 block">
                    Rate Your VijayaHub Experience:
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-hidden hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">
                    {rating === 5 && '⭐⭐⭐⭐⭐ Excellent (5/5)'}
                    {rating === 4 && '⭐⭐⭐⭐ Very Good (4/5)'}
                    {rating === 3 && '⭐⭐⭐ Average (3/5)'}
                    {rating === 2 && '⭐⭐ Needs Improvement (2/5)'}
                    {rating === 1 && '⭐ Poor (1/5)'}
                  </span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-semibold"
                  />
                </div>
              </div>

              {/* Optional Order ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Order ID (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. #VH-1024 (if relating to an existing pickup)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Details: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    type === 'complaint'
                      ? 'Please describe the issue with your items or pickup handover so we can rectify it...'
                      : 'Tell us how we can serve you better...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting to Store Team...
                  </span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback to Store Management</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
