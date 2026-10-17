import React, { useState } from 'react';
import { X, Bell, CheckCircle2, Phone, Mail, User, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function NotifyMeModal() {
  const { notifyMeProduct, setNotifyMeProduct, requestStockNotification, currentUser } = useStore();
  const [contact, setContact] = useState(currentUser?.phone || currentUser?.email || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!notifyMeProduct) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.trim()) {
      setError('Please provide a mobile number or email address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await requestStockNotification({
        productId: notifyMeProduct.id,
        productTitle: notifyMeProduct.title,
        contact: contact.trim(),
        name: name.trim() || 'Wholesale Buyer',
      });
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to register notification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setNotifyMeProduct(null);
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#154d28] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Bell className="w-4 h-4 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Stock Alert Notification</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Get notified the moment this item rests</p>
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
            src={notifyMeProduct.images?.[0] || notifyMeProduct.image}
            alt={notifyMeProduct.title}
            className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0 bg-white"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase">
              {notifyMeProduct.category || 'Wholesale'}
            </span>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate mt-1">
              {notifyMeProduct.title}
            </h4>
            <div className="text-xs font-black text-[#154d28] mt-0.5">
              ₹{notifyMeProduct.price} wholesale
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900">You're on the priority list!</h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                We'll ping <strong>{contact}</strong> as soon as VijayHub Vizag stocks arrives and this item becomes available.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 w-full py-2.5 bg-[#154d28] hover:bg-[#113e20] text-white font-bold text-sm rounded-xl transition shadow-sm"
              >
                Got It, Thank You
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                This item is currently out of stock at our counter warehouse. Enter your mobile or email to get a WhatsApp / SMS alert when stock arrives.
              </p>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kirana Store"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154d28] focus:border-[#154d28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number / WhatsApp / Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="9876543210 or store@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154d28] focus:border-[#154d28]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>{submitting ? 'Registering...' : 'Notify Me When Available'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
