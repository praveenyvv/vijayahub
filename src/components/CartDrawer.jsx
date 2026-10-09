import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Store, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = storeInfo.freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="font-extrabold text-slate-900 text-lg">Your Cart</h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-amber-50/70 p-3.5 border-b border-amber-200/60">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                {amountNeededForFreeDelivery > 0 ? (
                  <span className="text-amber-800 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    Add ₹{amountNeededForFreeDelivery.toLocaleString('en-IN')} more for <strong>FREE 20KM Delivery</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1 font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    🎉 You unlocked FREE 20KM Doorstep Delivery!
                  </span>
                )}
                <span className="text-slate-500">{Math.round(deliveryProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-5">
                  Explore fresh dry fruits from our farm or heavy-duty kitchen appliances at direct Vizag warehouse rates.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-18 h-18 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-amber-800 font-semibold">{item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-slate-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Fulfillment Choice:</span>
                  <span className="font-medium text-slate-700">Selected at Checkout</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-lg text-amber-700">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Store className="w-3 h-3 text-amber-600" /> Free Store Pickup
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-orange-600" /> 20 KM Local Delivery
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
