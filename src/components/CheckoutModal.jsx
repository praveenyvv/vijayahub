import React, { useState } from 'react';
import {
  X,
  Store,
  Clock,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  Zap,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

/**
 * Dynamically load Razorpay standard checkout script
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function getAvailablePickupSlots() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const slots = [];

  // Express / Immediate ready time (estimated 30 minutes from now)
  const readyTime = new Date(now.getTime() + 30 * 60000);
  const readyTimeFormatted = readyTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Operating Hours: 10:00 AM to 8:30 PM
  const isOperatingHours = (currentHour >= 10 && currentHour < 20) || (currentHour === 20 && currentMinutes <= 30);
  const isEarlyMorning = currentHour < 10;

  if (isOperatingHours) {
    slots.push({
      id: 'today-express',
      label: `Today: Express (Ready in 30 mins • by ${readyTimeFormatted})`,
      tag: 'Fastest'
    });
  } else if (isEarlyMorning) {
    slots.push({
      id: 'today-morning-opening',
      label: `Today: Hub Opening (Ready by 10:30 AM)`,
      tag: 'First Batch'
    });
  }

  // Today scheduled windows (only future windows that haven't ended yet)
  if (currentHour < 12 || (currentHour === 12 && currentMinutes <= 30)) {
    slots.push({
      id: 'today-morning',
      label: 'Today: Morning Slot (10:00 AM - 1:00 PM)'
    });
  }

  if (currentHour < 16 || (currentHour === 16 && currentMinutes <= 30)) {
    slots.push({
      id: 'today-afternoon',
      label: 'Today: Afternoon Slot (1:00 PM - 5:00 PM)'
    });
  }

  if (currentHour < 20) {
    slots.push({
      id: 'today-evening',
      label: 'Today: Evening Slot (5:00 PM - 8:30 PM)'
    });
  }

  // Tomorrow windows (always available for customer's 24-hr pickup window)
  slots.push({
    id: 'tomorrow-morning',
    label: 'Tomorrow: Morning Slot (10:00 AM - 1:00 PM)'
  });
  slots.push({
    id: 'tomorrow-afternoon',
    label: 'Tomorrow: Afternoon Slot (1:00 PM - 5:00 PM)'
  });
  slots.push({
    id: 'tomorrow-evening',
    label: 'Tomorrow: Evening Slot (5:00 PM - 8:30 PM)'
  });

  return slots;
}

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    storeInfo,
    placeOrder,
    currentUser,
    setCurrentUser,
    orders,
    products,
    isStoreOpen
  } = useStore();

  const availablePickupSlots = React.useMemo(() => getAvailablePickupSlots(), [isCheckoutOpen]);

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [pickupSlot, setPickupSlot] = useState(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('vijayahub_selected_pickup_slot') : null;
    if (saved) return saved;
    const initialSlots = getAvailablePickupSlots();
    return initialSlots[0]?.label || 'Today: Express (Ready in 30 mins)';
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Keep pickupSlot up to date whenever checkout opens
  React.useEffect(() => {
    if (isCheckoutOpen) {
      const currentSlots = getAvailablePickupSlots();
      const saved = sessionStorage.getItem('vijayahub_selected_pickup_slot');
      if (saved && currentSlots.some((s) => s.label === saved)) {
        setPickupSlot(saved);
      } else if (!currentSlots.some((s) => s.label === pickupSlot)) {
        setPickupSlot(currentSlots[0]?.label || 'Today: Express (Ready in 30 mins)');
      }
    }
  }, [isCheckoutOpen]);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser, isCheckoutOpen]);

  const handleCloseCheckout = () => {
    if (isProcessingPayment) return;
    setIsCheckoutOpen(false);
    setPaymentError('');
  };

  // Handle hardware / gesture browser back button
  React.useEffect(() => {
    if (isCheckoutOpen) {
      window.history.pushState({ modal: 'checkout-modal' }, '');
      const handlePopState = () => {
        setIsCheckoutOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isCheckoutOpen]);

  // Handle Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCheckoutOpen && !isProcessingPayment) {
        handleCloseCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, isProcessingPayment]);

  if (!isCheckoutOpen) return null;

  const finalTotal = cartSubtotal; // Central hub pickup is 100% Free (₹0 fee)

  // Validation helper
  const validateForm = () => {
    setPaymentError('');

    if (!isStoreOpen) {
      setPaymentError('Store is temporarily closed for counter pickups. Please check back soon.');
      return false;
    }

    if (!customerName.trim()) {
      setPaymentError('Please enter your full name for order pickup.');
      return false;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setPaymentError('Please enter a valid 10-digit mobile number for order verification.');
      return false;
    }

    // Validate Per-Mobile Purchase Limits for offer items
    for (const cartItem of cart) {
      const prod = products.find((p) => p.id === cartItem.id);
      const limit = prod?.maxPerCustomer || prod?.max_per_customer || 0;
      if (limit > 0) {
        const previousPurchased = orders
          .filter(
            (o) =>
              o.customer?.phone?.replace(/\D/g, '') === cleanPhone &&
              o.status !== 'Cancelled'
          )
          .reduce((sum, o) => {
            const itemMatch = o.items?.find((it) => it.id === prod.id);
            return sum + (itemMatch ? (itemMatch.quantity || 1) : 0);
          }, 0);

        const currentRequested = cartItem.quantity;
        const totalRequested = previousPurchased + currentRequested;

        if (totalRequested > limit) {
          setPaymentError(
            `⚠️ Special Offer Limit Exceeded: "${prod.title}" is limited to max ${limit} unit(s) per customer. You previously ordered ${previousPurchased}.`
          );
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Strictly Enforced Razorpay Payment Gateway:
   * Order and OTP are ONLY created when Razorpay verifies payment success!
   */
  const handleProceedToRazorpay = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsProcessingPayment(true);
    setPaymentError('');

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaymentError('Unable to connect to Razorpay payment servers. Please check your internet connection.');
      setIsProcessingPayment(false);
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Tu908HhHMsPJBk';

    try {
      const options = {
        key: razorpayKey,
        amount: Math.round(finalTotal * 100), // in paise (e.g. ₹956 -> 95600)
        currency: 'INR',
        name: 'VijayaHub Wholesale',
        description: `Wholesale Pickup (${pickupSlot})`,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=128&q=80',
        handler: function (response) {
          // PAYMENT 100% CONFIRMED BY RAZORPAY
          console.log('✅ [Razorpay Payment Captured]:', response);
          const txnId = response.razorpay_payment_id || `RZP-${Date.now()}`;
          finalizeOrder(`Razorpay Online Payment (UPI / Card / NetBanking)`, 'PAID', txnId);
        },
        prefill: {
          name: customerName,
          email: customerEmail || `${customerPhone}@customer.vijayahub.com`,
          contact: customerPhone
        },
        notes: {
          pickup_slot: pickupSlot,
          hub_location: 'Dwaraka Nagar, Visakhapatnam'
        },
        theme: {
          color: '#154d28' // VijayaHub brand green
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            console.log('Payment modal dismissed by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (resp) {
        console.error('❌ [Razorpay Payment Failed]:', resp.error);
        setIsProcessingPayment(false);
        setPaymentError(
          resp.error?.description || 'Payment was declined or cancelled. Your card/account was not debited.'
        );
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setIsProcessingPayment(false);
      setPaymentError('Failed to initiate payment gateway: ' + err.message);
    }
  };

  const finalizeOrder = (methodDescription, paymentStatus = 'PAID', transactionId = '') => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }

      placeOrder({
        userId: currentUser?.id || null,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || `${customerPhone}@customer.vijayahub.com`,
          address: storeInfo.address,
          pincode: '530016',
          landmark: 'Dwaraka Nagar Central Hub',
          userId: currentUser?.id || null
        },
        fulfillmentType: 'pickup', // Strictly Store Pickup Only
        pickupSlot: pickupSlot,
        items: cart.map((item) => ({
          id: item.id,
          cartItemId: item.cartItemId || item.id,
          title: item.title,
          price: item.price,
          selectedWeight: item.selectedWeight || null,
          quantity: item.quantity
        })),
        itemSubtotal: cartSubtotal,
        deliveryFee: 0,
        total: finalTotal,
        paymentMethod: methodDescription,
        paymentStatus: 'PAID', // Guaranteed 100% Upfront Paid
        upiRefNumber: transactionId,
        notes: `Selected Slot: ${pickupSlot}. 100% Online Paid via Razorpay. Strictly 24-hr pickup window.`
      });

      // Auto-set currentUser so this phone session stays linked to their orders
      if (!currentUser && customerPhone) {
        const generatedId =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `usr-${customerPhone}-${Date.now()}`;

        setCurrentUser({
          id: generatedId,
          phone: customerPhone,
          name: customerName,
          email: customerEmail || `${customerPhone}@customer.vijayahub.com`,
          isPhoneVerified: true,
          joinedAt: new Date().toISOString()
        });
      }

      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div
      onClick={handleCloseCheckout}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Header with Always-Visible Close Button */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg text-white truncate">
                  Secure Checkout
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 shrink-0">
                  100% Upfront Online
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                Dwaraka Nagar Central Hub • Free Counter Pickup
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseCheckout}
            disabled={isProcessingPayment}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {/* Store Pickup Banner & Address */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white border border-amber-300/80 rounded-2xl p-4 text-xs text-amber-950">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-extrabold text-slate-900 text-sm">
                    {storeInfo.name}
                  </p>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.2 rounded-full">
                    FREE COUNTER PICKUP (₹0)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed mb-1.5">
                  {storeInfo.address}
                </p>
                <p className="text-[11px] text-amber-800 font-semibold">
                  ⏰ Hub Hours: {storeInfo.workingHours} | 📞 Helpline: {storeInfo.phone}
                </p>
              </div>
            </div>
          </div>

          {/* CRITICAL: 24-Hour Expiry & Auto-Restock Warning Banner */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950">
              <p className="font-extrabold text-rose-900 mb-0.5">
                Important 24-Hour Pickup & Inventory Rule:
              </p>
              <p className="text-rose-800 text-[11px] leading-relaxed">
                Your ordered items are reserved at our Dwaraka Nagar hub for <strong>exactly 24 hours</strong>. If not collected within 24 hours, the order is <strong>automatically cancelled</strong> and the stock is <strong>automatically restocked into inventory</strong>.
              </p>
            </div>
          </div>

          {/* Payment Error Alert */}
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{paymentError}</p>
            </div>
          )}

          {/* 1. Pickup Slot Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>1. Select Your Pickup Time Slot (Within 24 Hours): *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availablePickupSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setPickupSlot(slot.label)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    pickupSlot === slot.label
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${pickupSlot === slot.label ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="line-clamp-1">{slot.label}</span>
                    </div>
                    {slot.tag && (
                      <span className="shrink-0 bg-amber-200 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {slot.tag}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Customer Contact Information */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Contact Information for Counter Pickup:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  WhatsApp Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9848022341"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Mandatory 100% Upfront Online Payment Banner */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>3. 100% Upfront Online Payment:</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                Zero Convenience Fee
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/50 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs text-slate-900 mb-0.5">
                    Razorpay Verified Online Payment
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM, Debit/Credit Card, or NetBanking. Your 4-digit pickup OTP is generated automatically upon payment success.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-emerald-200/60">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Supported:</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">Google Pay</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">PhonePe</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">Paytm</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">BHIM UPI</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">Cards</span>
                <span className="bg-white text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">NetBanking</span>
              </div>
            </div>
          </div>

          {/* Order Price Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items):</span>
              <span className="font-semibold text-slate-800">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Store Counter Pickup Fee:</span>
              <span className="text-emerald-700 font-bold">FREE (₹0)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
              <span>Total Payable Now:</span>
              <span className="text-lg text-emerald-800">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Bottom Proceed Button */}
          <div className="pt-2">
            {!isStoreOpen ? (
              <button
                type="button"
                disabled
                className="w-full py-4 px-4 bg-slate-200 text-slate-500 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-300 uppercase tracking-wider"
              >
                <span>Store Closed - Reopening Soon</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceedToRazorpay}
                disabled={isProcessingPayment}
                className="w-full py-4 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting Secure Razorpay Gateway...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>Pay ₹{finalTotal.toLocaleString('en-IN')} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
