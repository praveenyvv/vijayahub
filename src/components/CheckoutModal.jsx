import React, { useState } from 'react';
import {
  X,
  Store,
  Truck,
  ShieldCheck,
  MapPin,
  Smartphone,
  Banknote,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    storeInfo,
    placeOrder
  } = useStore();

  // Multi-step checkout: 'details' -> 'payment' -> finish
  const [step, setStep] = useState('details'); // 'details' or 'payment'

  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' or 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Delivery fields
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('530016');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' or 'cod'
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isCheckoutOpen) return null;

  const upiId = storeInfo.upiId || '9392624326@idfcfirst';
  const payeeName = storeInfo.upiPayeeName || 'VijayaHub';

  // Pincode validation (Vizag pincodes generally start with 530xxx)
  const isVizagPincode = (code) => {
    const trimmed = code.trim();
    return /^5300\d{2}$/.test(trimmed) || /^531\d{3}$/.test(trimmed);
  };

  const validPincode = fulfillmentType === 'delivery' ? isVizagPincode(pincode) : true;

  // Delivery fee calculation
  const isFreeDelivery = cartSubtotal >= storeInfo.freeDeliveryThreshold;
  const deliveryFee =
    fulfillmentType === 'pickup' ? 0 : isFreeDelivery ? 0 : storeInfo.localDeliveryFlatFee;
  const finalTotal = cartSubtotal + deliveryFee;

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

  // Step 1 Validation & Proceed
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number for order updates.');
      return;
    }
    if (fulfillmentType === 'delivery') {
      if (!address.trim()) {
        alert('Please enter your complete delivery address in Visakhapatnam.');
        return;
      }
      if (!validPincode) {
        alert(
          'We currently only deliver within 20 KM radius of Visakhapatnam (Pincodes starting with 530xxx). Please choose Store Pickup instead.'
        );
        return;
      }
    }

    // If Cash on delivery / Pay on pickup, finalize immediately
    if (paymentMethod === 'cod') {
      finalizeOrder('Pay on Store Pickup / Cash on Delivery', 'PENDING_AT_HANDOVER');
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
          address: fulfillmentType === 'delivery' ? address : storeInfo.address,
          pincode: fulfillmentType === 'delivery' ? pincode : '530016',
          landmark: landmark || 'Dwaraka Nagar Hub'
        },
        fulfillmentType,
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        itemSubtotal: cartSubtotal,
        deliveryFee,
        total: finalTotal,
        paymentMethod: methodDescription,
        paymentStatus: paymentStatus,
        upiRefNumber: upiRefNumber || 'Direct UPI Transfer',
        notes: notes || 'Direct Order from vijayahub.com'
      });

      // Reset step
      setStep('details');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Back to Edit Details"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white">
                  {step === 'details' ? 'VijayaHub Checkout' : 'Scan UPI QR to Pay'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                  {step === 'details' ? 'Step 1 of 2' : 'Step 2: Payment'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {step === 'details'
                  ? 'Enter delivery details & select payment option'
                  : `Pay exactly ₹${finalTotal.toLocaleString('en-IN')} to ${upiId}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep('details');
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* STEP 1: DETAILS & METHOD SELECTION (NO QR CODE SHOWN HERE)   */}
        {/* ============================================================ */}
        {step === 'details' && (
          <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
            {/* 1. Fulfillment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Choose Receiving Method:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Store Pickup */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    fulfillmentType === 'pickup'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Store Pickup</span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      FREE (₹0)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Collect from Dwaraka Nagar hub. Ready in 30 minutes!
                  </p>
                </button>

                {/* Local 20 KM Delivery */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span>Local 20 KM Delivery</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">
                      {deliveryFee === 0 ? 'FREE' : `+₹${deliveryFee}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Doorstep delivery anywhere across Visakhapatnam.
                  </p>
                </button>
              </div>
            </div>

            {/* Pickup Details Box */}
            {fulfillmentType === 'pickup' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-900 mb-0.5">
                      Pickup Location: {storeInfo.name}
                    </p>
                    <p className="text-amber-800 text-[11px] leading-relaxed mb-1.5">
                      {storeInfo.address}
                    </p>
                    <p className="text-[10px] text-amber-700 font-semibold">
                      ⏰ Working Hours: {storeInfo.workingHours} | 📞 Helpline: {storeInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Customer Contact */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Your Contact Information:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Full Name *
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

            {/* 3. Delivery Address (Only if 20KM Delivery) */}
            {fulfillmentType === 'delivery' && (
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Delivery Address in Visakhapatnam:
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Door No, Flat, Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Flat 302, Sai Residency, Sector 4, MVP Colony"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600">Vizag Pincode *</label>
                      {pincode && (
                        <span
                          className={`text-[10px] font-bold ${
                            validPincode ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {validPincode ? '✓ Serviceable in Vizag' : '✗ Outside 20KM'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 530017"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-hidden font-mono font-bold ${
                        validPincode
                          ? 'bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-amber-500'
                          : 'bg-rose-50 border border-rose-300 text-rose-900 focus:ring-1 focus:ring-rose-500'
                      }`}
                    />
                    {!validPincode && (
                      <p className="text-[10px] text-rose-600 mt-1">
                        Please enter a valid Vizag pincode (530001–530052) or switch to Store Pickup.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Landmark / Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opp. Rythu Bazar"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Payment Option Choice */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {fulfillmentType === 'delivery' ? '4. Payment Preference:' : '3. Payment Preference:'}
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
                    Scan via PhonePe, GPay, Paytm on next screen
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
                    <span>
                      {fulfillmentType === 'pickup' ? 'Pay on Store Pickup' : 'Cash / UPI on Delivery'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Pay when you collect your order
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
                <span>
                  {fulfillmentType === 'pickup' ? 'Store Pickup Fee:' : 'Vizag 20 KM Delivery Fee:'}
                </span>
                <span className="font-semibold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
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
                    : `Confirm & Place Order (₹${finalTotal.toLocaleString('en-IN')})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: DEDICATED UPI PAYMENT SCREEN (SHOWN AFTER PROCEED)    */}
        {/* ============================================================ */}
        {step === 'payment' && (
          <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
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
                  Order Total for {customerName} ({fulfillmentType === 'pickup' ? 'Store Pickup' : '20 KM Delivery'})
                </p>
              </div>

              {/* High-Resolution Dynamic QR Code */}
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
                  After payment, enter your UTR number above and click the button below to confirm your order.
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
                    Recording Payment & Placing Order...
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
                <span>Go back and edit contact / delivery details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
