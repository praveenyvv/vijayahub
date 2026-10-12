import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import InvoiceModal from './components/InvoiceModal';
import AdminDashboard from './components/AdminDashboard';
import PolicyModal from './components/PolicyModal';
import UserAccountModal from './components/UserAccountModal';
import FeedbackSupportModal from './components/FeedbackSupportModal';
import Footer from './components/Footer';
import { Sparkles, Store, Clock, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

function StorefrontContent() {
  const {
    products,
    orders,
    currentUser,
    setIsAuthModalOpen,
    selectedCategory,
    searchQuery,
    isAdminMode,
    setSelectedCategory,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen
  } = useStore();

  const [activePolicy, setActivePolicy] = useState(null);

  // Active ongoing pickup order for current shopper (e.g. Placed, Packed, Ready for Pickup)
  const cleanUserPhone = currentUser?.phone?.replace(/\D/g, '');
  const activeOrder = cleanUserPhone
    ? orders.find(
        (o) =>
          o.customer?.phone?.replace(/\D/g, '') === cleanUserPhone &&
          o.status !== 'Completed' &&
          o.status !== 'Cancelled'
      )
    : null;

  // Filter products by Category & Search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AdminDashboard />
        </main>
        <InvoiceModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <HeroBanner />

        {/* Product Catalog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Try searching for something else or reset your category filters.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Why Buy Direct from VijayaHub (Trust Section) */}
        <section className="bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 my-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Direct From Source
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Why Visakhapatnam Chooses VijayaHub
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                We eliminate multi-tier distributor cuts, expensive marketplace commission fees, and shipping markups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  1. Free Central Hub Pickup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Located near RTC Complex in Dwaraka Nagar. Place your order online, skip the queue, and pick it up packed and ready within 30 minutes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  2. 24-Hour Pickup Window
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book online and pick your preferred time slot. Your order remains safely reserved for 24 hours at our Dwaraka Nagar hub.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  3. Verified Brand Warranty & FSSAI
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All dry fruits are fresh, crisp, and FSSAI certified. All kitchen appliances carry 100% genuine brand warranty cards and GST invoices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Local Vizag Reviews */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                What Vizag Customers Say
              </h3>
              <p className="text-xs text-slate-500">
                Verified reviews from our Dwaraka Nagar hub
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ⭐ 4.8 / 5.0 Rating
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center text-amber-400 text-xs">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Bought 1kg W-240 Cashews and California Almonds. Direct warehouse price was almost ₹250 cheaper than supermarket retail. Collected from Dwaraka Nagar store in 20 minutes!"
              </p>
              <div className="text-[11px] pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900">K. Satyanarayana</p>
                <p className="text-slate-400">MVP Colony, Vizag</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center text-amber-400 text-xs">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Ordered Preethi Zodiac mixer online and picked up from Dwaraka Nagar store during the evening slot. Inspected the box on the spot, verified warranty card. Great seamless experience!"
              </p>
              <div className="text-[11px] pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900">Anitha Reddy</p>
                <p className="text-slate-400">Gajuwaka, Vizag</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center text-amber-400 text-xs">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Pigeon induction stove plus Afghani Anjeer ordered together. Smooth online payment simulation and instant invoice download. Highly recommended local store."
              </p>
              <div className="text-[11px] pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900">V. Prasad</p>
                <p className="text-slate-400">Seethammadhara, Vizag</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      {/* Live Ongoing Pickup Order Pop-Up Bar (Blinkit style bottom notification) */}
      {activeOrder && (
        <div className="fixed bottom-18 sm:bottom-5 left-4 right-4 sm:left-auto sm:right-56 z-30 max-w-md animate-in slide-in-from-bottom duration-300">
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="cursor-pointer bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3 hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold shadow-md animate-pulse">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-white truncate">
                    Order #{activeOrder.id}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                    activeOrder.status === 'Ready for Pickup'
                      ? 'bg-emerald-400 text-emerald-950 animate-bounce'
                      : activeOrder.status === 'Packed'
                      ? 'bg-sky-400 text-sky-950'
                      : 'bg-amber-400 text-amber-950'
                  }`}>
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-0.5">
                  {activeOrder.status === 'Ready for Pickup'
                    ? '🎉 Ready at Dwaraka Nagar! Tap for OTP.'
                    : 'Packing your items at Dwaraka Nagar hub...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-extrabold shrink-0 pl-2 border-l border-slate-700">
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Floating Support & Feedback Pill for Shoppers */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-xl shadow-slate-900/30 flex items-center gap-2 border border-slate-700/60 hover:scale-105 active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Support & Feedback</span>
        </button>
      </div>

      {/* Global Interactive Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <InvoiceModal />
      <UserAccountModal />
      <FeedbackSupportModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      <PolicyModal policyType={activePolicy} onClose={() => setActivePolicy(null)} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
