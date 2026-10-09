import React from 'react';
import { ShoppingBag, Search, ShieldCheck, MapPin, Phone, ArrowLeft, Store, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const {
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    isAdminMode,
    setIsAdminMode,
    searchQuery,
    setSearchQuery,
    storeInfo
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar for Vizag Local Focus */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-200 shrink-0" />
            <span>
              Direct-to-Consumer Central Hub: Free Store Pickup in <strong>Dwaraka Nagar, Vizag</strong> — Collect Within 24 Hours!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-amber-100">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> No Middlemen • Wholesale Savings
            </span>
            <a
              href={`https://wa.me/919848054321?text=Hello%20VijayaHub,%20I%20have%20an%20enquiry`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-white hover:underline font-semibold"
            >
              <Phone className="w-3 h-3" /> WhatsApp: {storeInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminMode(false)}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-black text-xl tracking-tighter group-hover:scale-105 transition-transform">
              VH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                  Vijaya<span className="text-amber-600">Hub</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm">
                  Vizag
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Dry Fruits & Kitchen Appliances
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar (Customer mode only) */}
        {!isAdminMode ? (
          <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mixer grinder, cashews, almonds, induction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 px-4">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Owner Mode: Manage Products, Stock & Vizag Orders
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Toggle / Handover Switch */}
          {isAdminMode ? (
            <button
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Back to Storefront</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAdminMode(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
              title="Switch to Store Owner Admin Dashboard to add products, adjust stock, and handle orders"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Owner</span> Admin
            </button>
          )}

          {/* Cart Button (Always visible on storefront) */}
          {!isAdminMode && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm shadow-amber-600/30 transition-all text-xs sm:text-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-amber-700 font-extrabold text-xs px-1.5 py-0.2 rounded-full shadow-xs">
                  {cartItemCount}
                </span>
              )}
              {cartSubtotal > 0 && (
                <span className="hidden lg:inline text-amber-100 font-normal text-xs border-l border-amber-500 pl-2">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {!isAdminMode && (
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appliances, cashews, almonds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}
