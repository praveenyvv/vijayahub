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
import Footer from './components/Footer';
import { Sparkles, Store, Truck, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

function StorefrontContent() {
  const {
    products,
    selectedCategory,
    searchQuery,
    isAdminMode,
    setSelectedCategory
  } = useStore();

  const [activePolicy, setActivePolicy] = useState(null);

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
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  2. Prompt 20 KM Local Delivery
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast doorstep delivery across Vizag (MVP Colony, Gajuwaka, Madhurawada, Rushikonda). Free delivery on orders over ₹999!
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
                Verified reviews from our Dwaraka Nagar hub and local deliveries
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
                "Got Preethi Zodiac mixer delivered to Gajuwaka in 3 hours. Packed securely with original company warranty card and GST bill. Excellent service by VijayaHub team."
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

      {/* Global Interactive Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <InvoiceModal />
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
