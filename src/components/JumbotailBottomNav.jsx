import React from 'react';
import { Home, Grid, Package, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function JumbotailBottomNav({ setIsDrawerOpen }) {
  const {
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    setIsAuthModalOpen,
    setSelectedCategory,
    setSearchQuery,
    orders,
    currentUser,
    isCloudLoaded
  } = useStore();

  const cleanPhone = currentUser?.phone?.replace(/\D/g, '');
  const now = new Date();
  const activeOrdersCount = cleanPhone && isCloudLoaded
    ? (orders || []).filter(
        (o) =>
          o.customer?.phone?.replace(/\D/g, '') === cleanPhone &&
          o.status !== 'Completed' &&
          o.status !== 'Cancelled' &&
          (!o.expiresAt || new Date(o.expiresAt) > now)
      ).length
    : 0;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className="grid grid-cols-3 h-14">
        {/* Store / Home Tab */}
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('All');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-[#154d28] active:text-[#154d28] transition-colors"
        >
          <Home className="w-5 h-5 text-inherit" />
          <span className="text-[10px] font-bold mt-0.5">Store</span>
        </button>

        {/* Orders Tab */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="relative flex flex-col items-center justify-center text-slate-600 hover:text-[#154d28] active:text-[#154d28] transition-colors"
        >
          <div className="relative">
            <Package className="w-5 h-5 text-inherit" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">My Orders</span>
        </button>

        {/* Cart Tab */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center text-slate-600 hover:text-[#154d28] active:text-[#154d28] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-inherit" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#154d28] text-white text-[9px] font-black px-1 min-w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">
            {cartItemCount > 0 ? `₹${cartSubtotal}` : 'Cart'}
          </span>
        </button>
      </div>
    </nav>
  );
}
