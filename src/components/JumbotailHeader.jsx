import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  HelpCircle,
  Bell,
  Package,
  ShoppingBag,
  Camera,
  Mic,
  Barcode,
  X,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  Store,
  User,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import StaffPasscodeModal from './StaffPasscodeModal';

const SEARCH_PLACEHOLDERS = [
  'search for "Cashews"',
  'search for "Preethi Mixer"',
  'search for "California Almonds"',
  'search for "Induction Stove"',
  'search for "Afghani Anjeer"',
  'search for "Air Fryer"'
];

export default function JumbotailHeader({ isDrawerOpen, setIsDrawerOpen }) {
  const {
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    isAdminMode,
    setIsAdminMode,
    searchQuery,
    setSearchQuery,
    storeInfo,
    currentUser,
    orders,
    setIsAuthModalOpen,
    setIsFeedbackModalOpen,
    selectedCategory,
    setSelectedCategory,
    categories,
    isCloudLoaded
  } = useStore();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isBarcodeSimOpen, setIsBarcodeSimOpen] = useState(false);
  const [isStaffPasscodeOpen, setIsStaffPasscodeOpen] = useState(false);

  const handleOpenAdminPortal = () => {
    if (isAdminMode) {
      sessionStorage.removeItem('vijayahub_staff_auth');
      setIsAdminMode(false);
      return;
    }
    const isAuthed = sessionStorage.getItem('vijayahub_staff_auth') === 'true';
    if (isAuthed) {
      setIsAdminMode(true);
    } else {
      setIsStaffPasscodeOpen(true);
    }
  };

  // Rotating search placeholder like Jumbotail
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Active live orders for current shopper
  const cleanPhone = currentUser?.phone?.replace(/\D/g, '');
  const now = new Date();
  const activeOrders = cleanPhone && isCloudLoaded
    ? (orders || []).filter(
        (o) =>
          o.customer?.phone?.replace(/\D/g, '') === cleanPhone &&
          o.status !== 'Completed' &&
          o.status !== 'Cancelled' &&
          (!o.expiresAt || new Date(o.expiresAt) > now)
      )
    : [];
  const activeOrderCount = activeOrders.length;

  // Speech Recognition for Mic Icon
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported on this browser/device. Please type in the search bar.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          setSearchQuery(spoken);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Jumbotail Signature Forest Green Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#154d28] text-white shadow-md select-none">
        {/* Top Micro Location Bar */}
        <div className="bg-[#0f3d1f] text-emerald-100 text-[11px] px-3 py-1 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              Wholesale Hub: <strong>Dwaraka Nagar, Vizag</strong> • Direct Warehouse Rates
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Sparkles className="w-3 h-3" /> Ready in 30 Mins
            </span>
            <a
              href={`https://wa.me/919848054321?text=Hello%20VijayaHub,%20I%20have%20an%20enquiry`}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> {storeInfo.phone}
            </a>
          </div>
        </div>

        {/* Main Brand & Action Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          {/* Left: Hamburger & Brand Name */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="w-9 h-9 rounded-lg hover:bg-white/10 active:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#0f3d1f] font-black text-lg flex items-center justify-center shadow-xs">
                VH
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white">
                  Vijaya<span className="text-amber-400">Hub</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-1.5 py-0.2 rounded-sm ml-1.5 border border-emerald-700/60 hidden xs:inline">
                  Vizag
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Icons (Help, Notifications, Orders, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Help / Support Icon */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-emerald-100 hover:text-white transition-colors"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="relative w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-emerald-100 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {activeOrderCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Box / Orders Icon */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="relative w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-emerald-100 hover:text-white transition-colors"
              title="My Orders & OTP"
            >
              <Package className="w-5 h-5" />
              {activeOrderCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Cart Icon (Always visible on desktop and mobile) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors shadow-xs ml-1"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Switch (Desktop shortcut) */}
            <button
              type="button"
              onClick={handleOpenAdminPortal}
              className="hidden lg:flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-900 text-amber-300 border border-emerald-700/60 ml-2"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Customer Store' : 'Counter Admin'}</span>
            </button>
          </div>
        </div>

        {/* Jumbotail Signature Integrated Search Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-2.5 pt-0.5">
          <div className="relative flex items-center">
            {/* Search Input Container */}
            <div className="relative w-full flex items-center bg-white rounded-xl shadow-inner border border-emerald-900/30 overflow-hidden">
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-4 h-4 text-slate-500" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                className="w-full py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}

              {/* Jumbotail Action Icons on Right: Camera, Mic, Barcode */}
              <div className="flex items-center gap-1.5 pr-2.5 shrink-0 text-slate-600">
                {/* Camera Icon */}
                <button
                  type="button"
                  onClick={() => setIsBarcodeSimOpen(true)}
                  className="p-1 hover:text-[#154d28] hover:bg-slate-100 rounded-md transition-colors"
                  title="Visual Product Search"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Microphone Voice Search */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1 rounded-md transition-colors ${
                    isListening ? 'text-rose-600 bg-rose-50 animate-pulse' : 'hover:text-[#154d28] hover:bg-slate-100'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Barcode Scanner Icon */}
                <button
                  type="button"
                  onClick={() => setIsBarcodeSimOpen(true)}
                  className="p-1 hover:text-[#154d28] hover:bg-slate-100 rounded-md transition-colors"
                  title="Scan Barcode / QR"
                >
                  <Barcode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Jumbotail Side Drawer Menu (Slide-out Navigation) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="bg-[#154d28] text-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-[#154d28] font-black text-lg flex items-center justify-center">
                    VH
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base leading-tight">VijayaHub</h2>
                    <p className="text-[10px] text-emerald-200">Wholesale & D2C Hub</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User greeting */}
              <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-semibold truncate">
                    {currentUser?.name ? `Hi, ${currentUser.name}` : 'Welcome, Shopper'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="text-amber-300 font-bold hover:underline text-[11px]"
                >
                  {currentUser ? 'Profile' : 'Sign In'}
                </button>
              </div>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Store Categories
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-emerald-50 text-[#154d28]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>📦 All Products</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-50 text-[#154d28]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat === 'Dry Fruits & Nuts' ? '🌾' : '⚡'} {cat}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-3 border-t border-slate-100 my-2" />

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Account & Orders
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#154d28]" />
                  <span>My Orders & Pickup OTP</span>
                </div>
                {activeOrderCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {activeOrderCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#154d28]" />
                  <span>My Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="bg-[#154d28] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsFeedbackModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#154d28]" />
                  <span>Help & Customer Feedback</span>
                </div>
              </button>

              <div className="pt-3 border-t border-slate-100 my-2" />

              {/* Dwaraka Nagar Hub Info */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-950">
                <p className="font-bold flex items-center gap-1 text-amber-900 mb-1">
                  <Store className="w-3.5 h-3.5 text-amber-700" /> Dwaraka Nagar Central Hub
                </p>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  Near RTC Complex, Vizag. Pick up online orders packed in 30 mins.
                </p>
              </div>

              {/* Admin Mode Switch (RBAC Protected) */}
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleOpenAdminPortal();
                }}
                className="w-full mt-2 flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{isAdminMode ? 'Return to Store' : 'Counter Executive Admin'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode / Visual Search Modal Simulation */}
      {isBarcodeSimOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#154d28] flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Barcode className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Visual Scanner / Barcode Search
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Scan product QR codes or package barcodes at our Dwaraka Nagar counter to instantly view live stock and wholesale prices.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Cashews');
                  setIsBarcodeSimOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Scan Cashews W-240
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Preethi');
                  setIsBarcodeSimOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Scan Preethi Zodiac Mixer
              </button>
              <button
                type="button"
                onClick={() => setIsBarcodeSimOpen(false)}
                className="w-full py-2 text-slate-500 text-xs font-semibold hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Counter Staff RBAC Authentication Modal */}
      <StaffPasscodeModal
        isOpen={isStaffPasscodeOpen}
        onClose={() => setIsStaffPasscodeOpen(false)}
        onSuccess={() => {
          setIsStaffPasscodeOpen(false);
          setIsAdminMode(true);
        }}
      />
    </>
  );
}
