import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import JumbotailHeader from './components/JumbotailHeader';
import JumbotailCategorySections from './components/JumbotailCategorySections';
import JumbotailBottomNav from './components/JumbotailBottomNav';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import CategoryPageView from './components/CategoryPageView';
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
import { useAndroidBackButton } from './hooks/useAndroidBackButton';
import { Sparkles, Store, Clock, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, X, ShoppingBag } from 'lucide-react';

function StorefrontContent() {
  const {
    products,
    orders,
    currentUser,
    setIsAuthModalOpen,
    isAuthModalOpen,
    selectedProduct,
    setSelectedProduct,
    isCheckoutOpen,
    setIsCheckoutOpen,
    completedOrder,
    setCompletedOrder,
    invoiceOrder,
    setInvoiceOrder,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isAdminMode,
    setIsAdminMode,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isCloudLoaded,
    cartItemCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen
  } = useStore();

  const [activePolicy, setActivePolicy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissedOrderIds, setDismissedOrderIds] = useState(new Set());

  // Intercept Android hardware & gesture back button to close modals, drawer, search, or filters
  const { showExitToast } = useAndroidBackButton({
    isDrawerOpen,
    closeDrawer: () => setIsDrawerOpen(false),
    activePolicy,
    closePolicy: () => setActivePolicy(null),
    invoiceOrder,
    closeInvoice: () => setInvoiceOrder(null),
    completedOrder,
    closeSuccess: () => setCompletedOrder(null),
    isFeedbackModalOpen,
    closeFeedback: () => setIsFeedbackModalOpen(false),
    isAuthModalOpen,
    closeAuth: () => setIsAuthModalOpen(false),
    isCheckoutOpen,
    closeCheckout: () => setIsCheckoutOpen(false),
    selectedProduct,
    closeProduct: () => setSelectedProduct(null),
    isCartOpen,
    closeCart: () => setIsCartOpen(false),
    searchQuery,
    clearSearch: () => setSearchQuery(''),
    selectedCategory,
    resetCategory: () => setSelectedCategory('All'),
    isAdminMode,
    exitAdminMode: () => setIsAdminMode(false)
  });

  // Active ongoing pickup order for current shopper (e.g. Placed, Packed, Ready for Pickup)
  const cleanUserPhone = currentUser?.phone?.replace(/\D/g, '');
  const now = new Date();
  const activeOrder =
    cleanUserPhone && isCloudLoaded
      ? orders.find(
          (o) =>
            o.customer?.phone?.replace(/\D/g, '') === cleanUserPhone &&
            o.status !== 'Completed' &&
            o.status !== 'Cancelled' &&
            (!o.expiresAt || new Date(o.expiresAt) > now)
        )
      : null;

  const isOrderDismissed = activeOrder && dismissedOrderIds.has(activeOrder.id);
  const showActiveOrderBanner = activeOrder && !isOrderDismissed;

  // Auto-dismiss floating banner after 12 seconds so it doesn't disturb shopper
  React.useEffect(() => {
    if (activeOrder && !dismissedOrderIds.has(activeOrder.id)) {
      const timer = setTimeout(() => {
        setDismissedOrderIds((prev) => new Set([...prev, activeOrder.id]));
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [activeOrder?.id]);

  // Instant top scroll on category changes
  React.useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [selectedCategory]);

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <JumbotailHeader isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
        <main className="flex-1">
          <AdminDashboard />
        </main>
        <InvoiceModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9] text-slate-800">
      {selectedCategory !== 'All' ? (
        /* Dedicated Category Page View Architecture */
        <CategoryPageView
          onBackToHome={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        /* Standard Home Storefront View */
        <>
          {/* Jumbotail Inspired Top Forest Green Header */}
          <JumbotailHeader isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

          <main className="flex-1 pb-24 md:pb-12">
            {/* Banner with Direct Hub Perks */}
            <HeroBanner />

            {/* Jumbotail Signature 2-Column Mobile / 4-Column Desktop Category Showcase */}
            <JumbotailCategorySections />

            {/* Product Catalog Grid with Immediate Filter & Compact 2-Column Mobile View */}
            <ProductGrid />

            {/* Why Buy Direct from VijayaHub (Trust Section) */}
            <section className="bg-white border-y border-slate-200/80 py-10 px-4 sm:px-6 my-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold text-[#154d28] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Direct From Source
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Why Visakhapatnam Chooses VijayaHub
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Direct warehouse pricing, genuine brand warranties, and zero shipping markups.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-[#154d28] flex items-center justify-center mb-3">
                      <Store className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">
                      1. Free Central Hub Pickup
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Near RTC Complex in Dwaraka Nagar. Place your order online, skip the queue, and pick it up packed within 30 minutes.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">
                      2. 24-Hour Pickup Window
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Choose your preferred pickup slot. Your order remains safely reserved for 24 hours at our Dwaraka Nagar counter.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">
                      3. Verified Brand Warranty & FSSAI
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All dry fruits are fresh and FSSAI certified. All appliances carry 100% genuine brand warranty cards and GST invoices.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      {/* Jumbotail Mobile Bottom Navigation Bar (Home, Categories, Orders, Cart) */}
      <JumbotailBottomNav setIsDrawerOpen={setIsDrawerOpen} />

      {/* Android Hardware Back Press Exit Toast */}
      {showExitToast && (
        <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold py-2 px-4 rounded-full shadow-2xl backdrop-blur-xs border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
          Press back again to exit VijayaHub
        </div>
      )}

      {/* Persistent Mobile Sticky Bottom Cart Strip */}
      {cartItemCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="fixed bottom-16 inset-x-3 z-30 md:hidden animate-in slide-in-from-bottom-4 duration-200">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsCartOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsCartOpen(true);
              }
            }}
            className="bg-[#154d28] hover:bg-[#113e20] text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between cursor-pointer border border-emerald-400/40 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} | Dwaraka Nagar
                </div>
                <div className="text-base font-black text-white leading-tight">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs shrink-0">
              <span>View Cart & Pick Slot</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>
      )}

      {/* Live Ongoing Pickup Order Pop-Up Bar */}
      {showActiveOrderBanner && (
        <div className={`fixed left-3 right-3 sm:left-auto sm:right-6 z-30 max-w-md animate-in slide-in-from-bottom duration-300 ${
          cartItemCount > 0 ? 'bottom-34 sm:bottom-16' : 'bottom-16'
        }`}>
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="cursor-pointer bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-3 hover:bg-slate-800 transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold shadow-md animate-pulse">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-white truncate">
                    Order #{activeOrder.id}
                  </span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                    activeOrder.status === 'Ready for Pickup'
                      ? 'bg-emerald-400 text-emerald-950 animate-bounce'
                      : activeOrder.status === 'Packed'
                      ? 'bg-sky-400 text-sky-950'
                      : 'bg-amber-400 text-amber-950'
                  }`}>
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate mt-0.5">
                  {activeOrder.status === 'Ready for Pickup'
                    ? '🎉 Ready at Dwaraka Nagar! Tap for OTP.'
                    : 'Packing your items at Dwaraka Nagar hub...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-700">
              <span className="text-xs text-amber-400 font-extrabold">Track</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDismissedOrderIds((prev) => new Set([...prev, activeOrder.id]));
                }}
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-1"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

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
