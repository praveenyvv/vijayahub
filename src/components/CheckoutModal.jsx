import React, { useState } from 'react';
import {
  X,
  Store,
  Clock,
  ShieldCheck,
  MapPin,
  Smartphone,
  Banknote,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  CalendarCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

const PICKUP_SLOTS = [
  { id: 'today-now', label: 'Today: Immediate (Ready in 30 mins • 10 AM - 1 PM)' },
  { id: 'today-afternoon', label: 'Today: Afternoon (1:00 PM - 5:00 PM)' },
  { id: 'today-evening', label: 'Today: Evening (5:00 PM - 8:30 PM)' },
  { id: 'tomorrow-morning', label: 'Tomorrow: Morning (10:00 AM - 1:00 PM)' },
  { id: 'tomorrow-afternoon', label: 'Tomorrow: Afternoon (1:00 PM - 5:00 PM)' },
  { id: 'tomorrow-evening', label: 'Tomorrow: Evening (5:00 PM - 8:30 PM)' }
];

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
    products
  } = useStore();

  // Multi-step checkout: 'details' -> 'payment' -> finish
  const [step, setStep] = useState('details'); // 'details' or 'payment'

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [pickupSlot, setPickupSlot] = useState(PICKUP_SLOTS[0].label);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser, isCheckoutOpen]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' or 'cod'
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isCheckoutOpen) return null;

  const upiId = storeInfo.upiId || '9392624326@idfcfirst';
  const payeeName = storeInfo.upiPayeeName || 'VijayaHub';

  const finalTotal = cartSubtotal; // Store pickup is 100% Free (₹0 fee)

  // Generate real dynamic UPI intent URL with exact order amount
  const orderRef = Math.floor(1000 + Math.random() * 9000);
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(`VijayaHub Order ${orderRef}`)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Step 1: Proceed to Payment or Finish
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for order verification.');
      return;
    }

    // --- Validate Per-Mobile Purchase Limits for offer items ---
    for (const cartItem of cart) {
      const prod = products.find((p) => p.id === cartItem.id);
      const limit = prod?.maxPerCustomer || prod?.max_per_customer || 0;
      if (limit > 0) {
        // Calculate units previously purchased by this phone number across past non-cancelled orders
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
          alert(
            `⚠️ Special Offer Limit Exceeded!\n\n"${prod.title}" is limited to a maximum of ${limit} unit(s) per mobile number.\n\nYou have already purchased ${previousPurchased} unit(s) previously.\nPlease adjust your cart quantity to complete this order.`
          );
          return;
        }
      }
    }

    // If Pay at Store Counter on Pickup, finalize immediately
    if (paymentMethod === 'cod') {
      finalizeOrder('Pay at Store Counter on Pickup (Cash/UPI)', 'PENDING_AT_HANDOVER');
      return;
    }

    // Otherwise, move to Dedicated UPI QR Screen
    setStep('payment');
  };

  // Step 2: Finalize Order after Payment
  const handleConfirmPaid = () => {
    if (!upiRefNumber.trim()) {
      const confirmed = window.confirm(
        `Have you completed the UPI payment of ₹${finalTotal} to ${upiId}? Click OK if paid, or enter your 12-digit UTR/Ref number.`
      );
      if (!confirmed) return;
    }

    finalizeOrder(
      `Direct UPI (${upiId})${upiRefNumber ? ` • Ref: ${upiRefNumber}` : ''}`,
      'PAID'
    );
  };

  const finalizeOrder = (methodDescription, paymentStatus) => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }

      placeOrder({
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || `${customerPhone}@customer.vijayahub.com`,
          address: storeInfo.address,
          pincode: '530016',
          landmark: 'Dwaraka Nagar Central Hub'
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
        paymentStatus: paymentStatus,
        upiRefNumber: upiRefNumber || 'Counter Payment',
        notes: `Selected Slot: ${pickupSlot}. Strictly 24-hr pickup window.`
      });

      // Auto-set currentUser so this phone session stays linked to their orders
      if (!currentUser && customerPhone) {
        setCurrentUser({
          phone: customerPhone,
          name: customerName,
          email: customerEmail || `${customerPhone}@customer.vijayahub.com`,
          joinedAt: new Date().toISOString()
        });
      }

      // Reset step
      setStep('details');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header with Always-Visible Close Button */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                title="Back to Edit Details"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg text-white truncate">
                  {step === 'details' ? 'Store Pickup Checkout' : 'Scan UPI QR to Pay'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30 shrink-0">
                  {step === 'details' ? 'Step 1: Details' : 'Step 2: Payment'}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {step === 'details'
                  ? 'Direct Store Pickup • Dwaraka Nagar, Vizag'
                  : `Pay exactly ₹${finalTotal.toLocaleString('en-IN')} to ${upiId}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep('details');
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors shrink-0 shadow-xs"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* STEP 1: DETAILS & PICKUP SLOT SELECTION (NO QR CODE HERE)    */}
        {/* ============================================================ */}
        {step === 'details' && (
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
                      FREE (₹0 Fee)
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
                  Your ordered items are reserved at our Dwaraka Nagar hub for <strong>exactly 24 hours</strong>. If not collected within 24 hours, the order is <strong>automatically cancelled</strong> and the stock is <strong>automatically restocked into inventory</strong> for other customers.
                </p>
              </div>
            </div>

            {/* 1. Pickup Slot Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>1. Select Your Pickup Time Slot (Within 24 Hours): *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PICKUP_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPickupSlot(slot.label)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      pickupSlot === slot.label
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarCheck className={`w-3.5 h-3.5 ${pickupSlot === slot.label ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="line-clamp-1">{slot.label}</span>
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

            {/* 3. Payment Preference */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Payment Preference:
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Gateway Fees
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'upi_qr'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>Instant UPI QR Code</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Pay now via GPay / PhonePe (Fast pickup)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Pay at Counter</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Pay cash/UPI when you inspect items at hub
                  </p>
                </button>
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
                <span>Store Pickup Fee:</span>
                <span className="text-emerald-700 font-bold">FREE (₹0)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Final Total to Pay:</span>
                <span className="text-lg text-amber-700">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all active:scale-[0.99]"
              >
                <span>
                  {paymentMethod === 'upi_qr'
                    ? `Proceed to UPI Payment (₹${finalTotal.toLocaleString('en-IN')})`
                    : `Confirm Store Pickup Order (₹${finalTotal.toLocaleString('en-IN')})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: DEDICATED UPI PAYMENT SCREEN                         */}
        {/* ============================================================ */}
        {step === 'payment' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
            <div className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-500/30 rounded-3xl p-5 text-center space-y-4">
              <div className="flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-extrabold mb-2">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>Scan to Pay Exact Amount</span>
                </div>

                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Store Pickup Order for <strong>{customerName}</strong> ({pickupSlot})
                </p>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-200 inline-block relative">
                  <QRCodeSVG
                    value={upiDeepLink}
                    size={200}
                    level="H"
                    includeMargin={false}
                    className="rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white shadow-md border-2 border-amber-400 flex items-center justify-center font-black text-[10px] text-amber-800">
                      VH
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2.5 font-bold">
                  Scan using: Google Pay • PhonePe • Paytm • BHIM • Cred
                </p>
              </div>

              {/* Mobile One-Tap Intent Button */}
              <div className="pt-1">
                <a
                  href={upiDeepLink}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-600/25 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tap to Pay on Mobile (GPay / PhonePe / Paytm)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Direct UPI Account Details */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between text-left">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Bank UPI ID:
                  </p>
                  <p className="font-mono font-extrabold text-xs text-slate-900">{upiId}</p>
                  <p className="text-[10px] text-slate-500">
                    Bank: <strong>IDFC FIRST Bank</strong> (Account: {payeeName})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* 12-digit UTR Input */}
              <div className="text-left bg-white rounded-2xl p-3.5 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800">
                    Enter 12-Digit UPI Transaction ID / UTR Number:
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">From GPay/PhonePe</span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 428901234567"
                  value={upiRefNumber}
                  onChange={(e) => setUpiRefNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono font-bold"
                />
                <p className="text-[10px] text-slate-500">
                  After payment, enter your UTR number above and click the button below to reserve your parcel.
                </p>
              </div>
            </div>

            {/* Confirm Payment Action Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleConfirmPaid}
                disabled={isProcessingPayment}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Reserving Items & Placing Order...
                  </span>
                ) : (
                  <>
                    <span>I Have Paid ₹{finalTotal.toLocaleString('en-IN')} • Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go back and edit slot / contact details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
