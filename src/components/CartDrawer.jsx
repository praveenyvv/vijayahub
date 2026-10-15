import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Store, Clock, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getAvailablePickupSlots } from './CheckoutModal';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    setIsCheckoutOpen,
    storeInfo
  } = useStore();

  const availableSlots = React.useMemo(() => getAvailablePickupSlots(), [isCartOpen]);

  const [selectedSlot, setSelectedSlot] = useState(() => {
    return sessionStorage.getItem('vijayahub_selected_pickup_slot') || availableSlots[0]?.label || 'Today: Express (Ready in 30 mins)';
  });

  useEffect(() => {
    if (isCartOpen) {
      const currentSlots = getAvailablePickupSlots();
      const saved = sessionStorage.getItem('vijayahub_selected_pickup_slot');
      if (saved && currentSlots.some((s) => s.label === saved)) {
        setSelectedSlot(saved);
      } else if (currentSlots[0]) {
        setSelectedSlot(currentSlots[0].label);
      }
    }
  }, [isCartOpen]);

  const handleSelectSlot = (slotLabel) => {
    setSelectedSlot(slotLabel);
    try {
      sessionStorage.setItem('vijayahub_selected_pickup_slot', slotLabel);
    } catch {
      // ignore
    }
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleProceedToCheckout = () => {
    try {
      sessionStorage.setItem('vijayahub_selected_pickup_slot', selectedSlot);
    } catch {
      // ignore
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Handle hardware / gesture browser back button
  useEffect(() => {
    if (isCartOpen) {
      window.history.pushState({ modal: 'cart-drawer' }, '');
      const handlePopState = () => {
        setIsCartOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isCartOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        handleCloseCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Estimated 5% GST included in wholesale prices
  const estimatedTaxIncluded = Math.round((cartSubtotal * 0.05) / 1.05);

  return (
    <div
      onClick={handleCloseCart}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
    >
      <div className="max-w-full flex">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 h-full"
        >
          {/* ========================================================== */}
          {/* 1. Header                                                  */}
          {/* ========================================================== */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight">
                  Your Wholesale Cart
                </h2>
                <span className="text-[11px] text-gray-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} reserved for self-pickup
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseCart}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              title="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================== */}
          {/* 2. Dwaraka Nagar Hub Pickup Banner                         */}
          {/* ========================================================== */}
          {cart.length > 0 && (
            <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Store className="w-4 h-4 text-[#154d28] shrink-0" />
                <span>
                  📍 <strong>Dwaraka Nagar Hub</strong> Counter Pickup
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#154d28] text-white px-2 py-0.5 rounded-full">
                ₹0 Fee
              </span>
            </div>
          )}

          {/* ========================================================== */}
          {/* 3. 30-Minute Pickup Slot Selector Chips                    */}
          {/* ========================================================== */}
          {cart.length > 0 && (
            <div className="p-3.5 bg-slate-50/70 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Select Express Pickup Slot:
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ⚡ Ready in 30 Mins
                </span>
              </div>

              {/* Pickup slot chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                {availableSlots.slice(0, 4).map((slot) => {
                  const isSelected = selectedSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectSlot(slot.label)}
                      className={`shrink-0 py-1.5 px-3 rounded-xl text-left border transition-all text-xs ${
                        isSelected
                          ? 'border-[#154d28] bg-[#154d28] text-white font-extrabold shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        {slot.tag && (
                          <span className={`text-[9px] px-1 py-0.2 rounded font-black uppercase ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {slot.tag}
                          </span>
                        )}
                        <span className="truncate max-w-[170px]">{slot.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 4. Cart Item List                                          */}
          {/* ========================================================== */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-5">
                  Explore fresh dry fruits, grains, and wholesale kitchen appliances at direct Dwaraka Nagar rates.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemKey = item.cartItemId || item.id;
                return (
                  <div
                    key={itemKey}
                    className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-2xs"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(itemKey)}
                            className="text-gray-400 hover:text-rose-600 p-0.5 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Category & Variant Weight Chip */}
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-[#154d28] font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                          {item.selectedWeight && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-200">
                              Pack: {item.selectedWeight}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Line Item Pricing & Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-sm text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            (₹{item.price} ea)
                          </span>
                        </div>

                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center border border-amber-300 rounded-lg bg-amber-50/70">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(itemKey, item.quantity - 1)}
                            className="w-6 h-6 hover:bg-amber-200 text-amber-900 rounded-l flex items-center justify-center font-black transition-colors"
                            title="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-black text-xs text-amber-950 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(itemKey, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-6 h-6 hover:bg-amber-200 text-amber-900 rounded-r flex items-center justify-center font-black transition-colors disabled:opacity-40"
                            title="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ========================================================== */}
          {/* 5. Clear Cost Breakdown & Checkout Action                   */}
          {/* ========================================================== */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total:</span>
                  <span className="font-extrabold text-gray-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Estimated GST (5% Included):</span>
                  <span className="font-medium text-emerald-700">
                    ₹{estimatedTaxIncluded.toLocaleString('en-IN')} (Included)
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Self-Pickup at Dwaraka Nagar:</span>
                  <span className="font-extrabold text-emerald-700 uppercase">
                    FREE (₹0)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                  <span>Final Payable Amount:</span>
                  <span className="text-xl text-[#154d28] font-black">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all uppercase tracking-wider active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* 24-Hour Reservation Guarantee Note */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Selected Slot: <strong>{selectedSlot}</strong> • Reserved 24 hrs</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
