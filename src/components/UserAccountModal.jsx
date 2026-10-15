import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  CalendarCheck,
  FileText,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Store,
  MapPin,
  Sparkles,
  Smartphone,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { sendPhoneOtp, verifyPhoneOtp, signOutAuthUser } from '../services/authService';

export default function UserAccountModal() {
  const {
    currentUser,
    setCurrentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    orders,
    setInvoiceOrder,
    storeInfo
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile'
  const [authStage, setAuthStage] = useState('phone'); // 'phone' or 'otp'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isDevBypass, setIsDevBypass] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
    setAuthStage('phone');
    setOtpCode('');
    setStatusMessage({ text: '', type: '' });
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setStatusMessage({ text: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const result = await sendPhoneOtp(cleanPhone);
      if (result.success) {
        setAuthStage('otp');
        setCountdown(60);
        setIsDevBypass(Boolean(result.isDevFallback));
        setStatusMessage({
          text: result.message || `Verification code sent to +91 ${cleanPhone.slice(-10)}`,
          type: result.isDevFallback ? 'info' : 'success'
        });
      } else {
        setStatusMessage({ text: result.error || 'Failed to send OTP. Please try again.', type: 'error' });
      }
    } catch (err) {
      setStatusMessage({ text: 'Network error sending OTP. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanOtp = (otpCode || '').trim();
    if (!cleanOtp) {
      setStatusMessage({ text: 'Please enter the 6-digit verification code.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const result = await verifyPhoneOtp(loginPhone, cleanOtp, loginName);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setActiveTab('orders');
        setAuthStage('phone');
        setOtpCode('');
        setStatusMessage({ text: 'Signed in successfully!', type: 'success' });
        // Close modal immediately so storefront advances into logged-in state
        setIsAuthModalOpen(false);
      } else {
        setStatusMessage({ text: result.error || 'Invalid OTP code. Please check and re-enter.', type: 'error' });
      }
    } catch (err) {
      setStatusMessage({ text: 'Error verifying OTP code.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevQuickVerify = async () => {
    setOtpCode('123456');
    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });
    try {
      const result = await verifyPhoneOtp(loginPhone || '9848012345', '123456', loginName);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setActiveTab('orders');
        setAuthStage('phone');
        setOtpCode('');
        // Close modal immediately so storefront advances into logged-in state
        setIsAuthModalOpen(false);
      } else {
        setStatusMessage({ text: result.error || 'Quick verify failed.', type: 'error' });
      }
    } catch (err) {
      console.warn('Dev verify error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAuthUser();
    setCurrentUser(null);
    setLoginPhone('');
    setLoginName('');
    setOtpCode('');
    setAuthStage('phone');
  };

  // Filter orders matching the logged in user phone, id, or email safely
  const cleanCurrentPhone = currentUser?.phone?.replace(/\D/g, '');
  const userOrders = React.useMemo(() => {
    if (!currentUser) return [];
    const allOrders = Array.isArray(orders) ? orders : [];
    return allOrders.filter((o) => {
      const orderPhone = (o.customer?.phone || '').replace(/\D/g, '');
      const phoneMatch = Boolean(
        cleanCurrentPhone && orderPhone && orderPhone.endsWith(cleanCurrentPhone.slice(-10))
      );
      const userMatch = Boolean(
        currentUser.id &&
          (o.userId === currentUser.id ||
            o.user_id === currentUser.id ||
            o.customer?.userId === currentUser.id)
      );
      const emailMatch = Boolean(currentUser.email && o.customer?.email === currentUser.email);
      return phoneMatch || userMatch || emailMatch;
    });
  }, [currentUser, orders, cleanCurrentPhone]);

  // Don't render modal when closed
  if (!isAuthModalOpen) return null;

  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {currentUser ? `Hi, ${currentUser.name}` : 'Customer Account & Orders'}
              </h3>
              <p className="text-xs text-slate-300">
                {currentUser
                  ? `Phone: ${currentUser.phone} • Dwaraka Nagar Store Pickup`
                  : 'Log in to track your 24-hr pickup orders & tax invoices'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs (If logged in) */}
        {currentUser && (
          <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'orders'
                  ? 'border-amber-600 text-amber-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({userOrders?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'profile'
                  ? 'border-amber-600 text-amber-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Hub Info</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* NOT LOGGED IN: REAL SECURE PHONE OTP FLOW */}
          {!currentUser ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-0.5">Secure Phone Verification</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Verify your phone number with an SMS OTP to access your orders, pickup codes, and GST tax invoices.
                  </p>
                </div>
              </div>

              {/* Status Notice */}
              {statusMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    statusMessage.type === 'error'
                      ? 'bg-rose-50 border border-rose-200 text-rose-800'
                      : statusMessage.type === 'info'
                      ? 'bg-sky-50 border border-sky-200 text-sky-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {authStage === 'phone' ? (
                /* STAGE 1: ENTER PHONE NUMBER */
                <form onSubmit={handleSendOtp} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9848012345"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 text-sm font-semibold focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Varma"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 text-sm focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loginPhone.length < 10}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Get Verification Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STAGE 2: ENTER OTP CODE */
                <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-600">
                      Code sent to: <strong className="text-slate-900">+91 {loginPhone.slice(-10)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthStage('phone')}
                      className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-center tracking-widest font-mono text-lg font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  {isDevBypass && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
                      <span>Dev Mode: Default test code is <strong>123456</strong></span>
                      <button
                        type="button"
                        onClick={handleDevQuickVerify}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                      >
                        1-Click Verify
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !otpCode}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    {countdown > 0 ? (
                      <span className="text-xs text-slate-400 font-medium">
                        Resend code in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'orders' ? (
            /* TAB 1: ORDER TRACKER (BLINKIT / ZEPTO STYLE) */
            <div className="space-y-4">
              {(userOrders?.length || 0) === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm mb-1">No orders found for this number</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                    Place an order on the storefront and select a 24-hr pickup slot at Dwaraka Nagar hub.
                  </p>
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                (userOrders || []).map((order) => {
                  const isCancelled = order.status === 'Cancelled' || order.status === 'Expired';
                  const isCompleted = order.status === 'Completed';

                  // Stepper statuses
                  const steps = ['Placed', 'Packed', 'Ready for Pickup', 'Completed'];
                  const currentStepIdx = isCancelled
                    ? -1
                    : steps.indexOf(order.status) !== -1
                    ? steps.indexOf(order.status)
                    : 0;

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-2xl bg-white p-4 sm:p-5 shadow-2xs space-y-3.5 hover:border-slate-300 transition"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 font-mono">
                              #{order.id}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                order.status === 'Expired'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : isCancelled
                                  ? 'bg-rose-100 text-rose-800'
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {order.status === 'Expired' ? 'Expired (24h Exceeded)' : order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Placed on {new Date(order.date).toLocaleDateString()} at{' '}
                            {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setInvoiceOrder(order);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual Stepper Tracker (Blinkit style) */}
                      {!isCancelled && (
                        <div className="py-1">
                          <div className="grid grid-cols-4 gap-1 relative">
                            {steps.map((st, sIdx) => {
                              const isPassed = sIdx <= currentStepIdx;
                              return (
                                <div key={st} className="text-center">
                                  <div
                                    className={`h-1.5 rounded-full mb-1.5 transition-all ${
                                      isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                                    }`}
                                  />
                                  <span
                                    className={`text-[10px] font-bold block leading-tight ${
                                      isPassed ? 'text-emerald-800' : 'text-slate-400'
                                    }`}
                                  >
                                    {st}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Pickup Window, Verification OTP & Slot Banner */}
                      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900">Pickup Slot: </span>
                              <span className="text-amber-900 font-semibold">{order.pickupSlot}</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">
                            Hub: Dwaraka Nagar
                          </span>
                        </div>

                        {/* Secure OTP Card for Counter Pickup Handover */}
                        {!isCancelled && (
                          <div className="bg-white border-2 border-dashed border-amber-400 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                            <div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                Counter Pickup Verification OTP
                              </span>
                              <p className="text-[11px] text-slate-600 font-medium">
                                Show this secret code to the store counter executive:
                              </p>
                            </div>
                            <div className="bg-amber-600 text-white font-mono font-black text-lg px-3 py-1 rounded-lg tracking-widest shadow-xs">
                              {order.pickupOtp || order.pickup_otp || order.customer?.pickupOtp || '4821'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items Breakdown */}
                      <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="font-medium line-clamp-1">
                              {it.quantity}x {it.title}
                              {it.selectedWeight && (
                                <span className="ml-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1 rounded">
                                  {it.selectedWeight}
                                </span>
                              )}
                            </span>
                            <span className="font-bold font-mono text-slate-900">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total Row */}
                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          Payment: {order.paymentMethod || 'UPI QR'}
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          Total Paid: ₹{order.total?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* TAB 2: PROFILE & HUB DETAILS */
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Customer Profile Details</h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Full Name:</span>
                    <span className="font-bold text-slate-900">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">WhatsApp Mobile:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">+91 {currentUser.phone}</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </div>
                  </div>
                  {currentUser.id && (
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Account ID:</span>
                      <span className="font-mono text-[10px] text-slate-600">
                        {currentUser.id.length > 20 ? `${currentUser.id.slice(0, 18)}...` : currentUser.id}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Preferred Pickup Store:</span>
                    <span className="font-bold text-amber-800">Dwaraka Nagar Central Hub</span>
                  </div>
                </div>
              </div>

              {/* Store Handover Location Card */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Central Counter Address</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {storeInfo.name} • {storeInfo.address} (Near RTC Complex, Vizag)
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-1 font-medium">
                  <span>⏰ Timings: {storeInfo.workingHours}</span>
                  <span>📞 Phone: {storeInfo.phone}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out from this Device</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
