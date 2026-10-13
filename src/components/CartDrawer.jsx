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

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Handle hardware / gesture browser back button
  React.useEffect(() => {
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
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        handleCloseCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = storeInfo.freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

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
              onClick={handleCloseCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store Pickup Banner */}
          {cart.length > 0 && (
            <div className="bg-amber-50/80 p-3.5 border-b border-amber-200/70">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Store className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Free Store Pickup at <strong>Dwaraka Nagar Hub</strong> (Reserved for 24 hrs)
                </span>
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
              cart.map((item) => {
                const itemKey = item.cartItemId || item.id;
                return (
                  <div
                    key={itemKey}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <img
                      src={item.images?.[0] || item.image}
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
                            onClick={() => removeFromCart(itemKey)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-amber-800 font-semibold">{item.category}</span>
                          {item.selectedWeight && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              {item.selectedWeight}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (₹{item.price} ea)
                          </span>
                        </div>

                        {/* Quantity Controller */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(itemKey, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs text-slate-800 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(itemKey, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40"
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
                  <Store className="w-3 h-3 text-amber-600" /> Free Store Pickup (₹0)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-amber-800">
                  ⚡ 24-Hour Pickup Window
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
