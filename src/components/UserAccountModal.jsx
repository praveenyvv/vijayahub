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
  ArrowLeft,
  Star,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { sendWhatsAppOtp, verifyPhoneOtp, signOutAuthUser, VIJAYAHUB_WHATSAPP_NUMBER } from '../services/authService';

export default function UserAccountModal() {
  const {
    currentUser,
    setCurrentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    orders,
    setInvoiceOrder,
    setReviewModalData,
    storeInfo
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile'
  const [authStage, setAuthStage] = useState('phone'); // 'phone' or 'otp'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for Resend OTP (60s)
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

  const handleGenerateWhatsAppOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setStatusMessage({ text: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const result = await sendWhatsAppOtp(cleanPhone, loginName);
      if (result.success) {
        setGeneratedOtp(result.otp);
        setWhatsappLink(result.whatsappUrl);
        setAuthStage('otp');
        setCountdown(60);
        setStatusMessage({
          text: `Verification OTP generated! Tap "Send on WhatsApp" to verify.`,
          type: 'success'
        });

        // Automatically open WhatsApp with pre-filled message
        if (typeof window !== 'undefined') {
          window.open(result.whatsappUrl, '_blank');
        }
      } else {
        setStatusMessage({ text: result.error || 'Failed to generate OTP. Please try again.', type: 'error' });
      }
    } catch (err) {
      setStatusMessage({ text: 'Error initiating WhatsApp verification. Please try again.', type: 'error' });
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

  const handleLogout = async () => {
    await signOutAuthUser();
    setCurrentUser(null);
    setLoginPhone('');
    setLoginName('');
    setOtpCode('');
    setGeneratedOtp('');
    setWhatsappLink('');
    setAuthStage('phone');
    setStatusMessage({ text: '', type: '' });
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
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
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
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
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
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
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
          {/* NOT LOGGED IN: 100% FREE WHATSAPP OTP FLOW */}
          {!currentUser ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-0.5">Instant WhatsApp 1-Tap OTP</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Verify in 3 seconds via WhatsApp to access your orders, pickup codes, and GST tax invoices. 100% free with zero telecom delays.
                  </p>
                </div>
              </div>

              {/* Status Notice */}
              {statusMessage.text && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed shadow-2xs ${
                    statusMessage.type === 'error'
                      ? 'bg-rose-50 border border-rose-300 text-rose-900'
                      : statusMessage.type === 'info'
                      ? 'bg-sky-50 border border-sky-200 text-sky-800'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {statusMessage.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-[11px] leading-relaxed">{statusMessage.text}</p>
                  </div>
                </div>
              )}

              {authStage === 'phone' ? (
                /* STAGE 1: ENTER PHONE NUMBER */
                <form onSubmit={handleGenerateWhatsAppOtp} className="space-y-3 pt-1">
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
                        className="w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-semibold focus:outline-hidden"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loginPhone.length < 10}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating WhatsApp OTP...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Get OTP via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STAGE 2: 1-TAP WHATSAPP CONFIRMATION & OTP INPUT */
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-xs bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-600">
                      Verifying: <strong className="text-slate-900">+91 {loginPhone.slice(-10)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStage('phone');
                        setOtpCode('');
                        setStatusMessage({ text: '', type: '' });
                      }}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change Phone</span>
                    </button>
                  </div>

                  {/* 1-Tap WhatsApp Action Card */}
                  <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border-2 border-emerald-400/60 rounded-2xl p-4 text-center space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-[11px] font-extrabold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Step 1: Tap to Send Code to VijayaHub</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      Your verification OTP is:
                    </p>
                    <p className="text-3xl font-black font-mono text-emerald-800 tracking-wider">
                      {generatedOtp}
                    </p>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Tap to Send on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Step 2: Enter OTP Code */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Step 2: Enter the 6-Digit Code Above to Confirm *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-center tracking-widest font-mono text-lg font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !otpCode}
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-extrabold text-sm shadow-md shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Open Account</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    {countdown > 0 ? (
                      <span className="text-xs text-slate-400 font-medium">
                        Resend in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGenerateWhatsAppOtp}
                        className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Resend WhatsApp Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'orders' ? (
            /* TAB 1: ORDER TRACKER (BLINKIT / ZEPTO STYLE) */
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-extrabold text-slate-700 text-sm">No Active Orders Yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Your wholesale orders and 24-hr counter pickup OTPs will appear here.
                  </p>
                </div>
              ) : (
                userOrders.map((order) => {
                  const isExp = order.status === 'Expired' || order.status === 'Cancelled';
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black font-mono text-slate-900 block">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.date || order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            order.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isExp
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Pickup OTP Display */}
                      {order.pickupOtp && !isExp && order.status !== 'Completed' && (
                        <div className="bg-amber-500 text-white rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider block font-bold text-amber-100">
                              Pickup Counter OTP:
                            </span>
                            <span className="font-mono font-black text-lg tracking-widest">
                              {order.pickupOtp}
                            </span>
                          </div>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                            Show at Hub
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-800">
                          ₹{order.total?.toLocaleString('en-IN')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceOrder(order);
                              setIsAuthModalOpen(false);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Tax Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* TAB 2: PROFILE & HUB INFO */
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <p className="font-extrabold text-sm text-slate-900">Your Contact Details</p>
                <p className="text-slate-600">
                  <strong>Name:</strong> {currentUser.name}
                </p>
                <p className="text-slate-600">
                  <strong>Mobile:</strong> +91 {currentUser.phone}
                </p>
                <p className="text-slate-600">
                  <strong>Account Status:</strong>{' '}
                  <span className="text-emerald-700 font-bold">Verified Customer</span>
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-1.5 text-amber-950">
                <p className="font-extrabold text-sm flex items-center gap-1.5 text-slate-900">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Central Pickup Hub</span>
                </p>
                <p className="text-[11px] text-slate-600">{storeInfo.address}</p>
                <p className="text-[11px] text-slate-600">
                  <strong>Hours:</strong> {storeInfo.workingHours}
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Helpline:</strong> {storeInfo.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from this Device</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
