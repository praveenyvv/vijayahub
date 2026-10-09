import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, Store, ShoppingBag, Plus, Minus, Check, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();
  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock <= 0;
  const discountPercent = Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100);

  const handleAddAndOpenCart = () => {
    addToCart(selectedProduct, qty);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-center relative">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            {selectedProduct.badge && (
              <span className="mt-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center gap-1 text-slate-700 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating || 4.8}</span>
                  <span className="text-slate-400">({selectedProduct.reviewsCount || 30} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-3">
                {selectedProduct.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {selectedProduct.description}
              </p>

              {/* Full Specs List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Specifications & Details:
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {selectedProduct.specs?.power && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">Power / Motor:</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.specs.power}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.warranty && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">Warranty:</span>
                      <span className="font-semibold text-emerald-700">{selectedProduct.specs.warranty}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.boxContents && (
                    <div className="flex flex-col border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">Box Contents:</span>
                      <span className="font-medium text-slate-800 text-[11px] mt-0.5">{selectedProduct.specs.boxContents}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.packWeight && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">Net Pack Weight:</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.specs.packWeight}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.grade && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">Quality Grade:</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.specs.grade}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.fssaiLicense && (
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500">FSSAI License:</span>
                      <span className="font-mono text-slate-800 font-semibold">{selectedProduct.specs.fssaiLicense}</span>
                    </div>
                  )}
                  {selectedProduct.specs?.origin && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Origin / Packing:</span>
                      <span className="font-semibold text-slate-900">{selectedProduct.specs.origin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vizag Delivery & Pickup badge */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">Free Store Pickup</p>
                    <p className="text-[10px] text-slate-500">Ready in 30 mins</p>
                  </div>
                </div>

                <div className="bg-orange-50/60 border border-orange-200/60 rounded-xl p-2.5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">20 KM Delivery</p>
                    <p className="text-[10px] text-slate-500">Doorstep in Vizag</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 font-bold text-sm text-slate-800 min-w-8 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => Math.min(selectedProduct.stock, prev + 1))}
                    disabled={qty >= selectedProduct.stock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ({selectedProduct.stock} units available)
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, qty);
                    setSelectedProduct(null);
                  }}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-xl border border-amber-600 text-amber-700 hover:bg-amber-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={handleAddAndOpenCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-600/30 disabled:opacity-50"
                >
                  Buy Now (Instant Checkout)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
