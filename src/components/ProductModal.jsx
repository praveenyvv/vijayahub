import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Store,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  Images
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const defaultVariant =
    selectedProduct?.variants && selectedProduct.variants.length > 0
      ? selectedProduct.variants.find((v) => v.isDefault) || selectedProduct.variants[0]
      : null;

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  React.useEffect(() => {
    setActiveImageIdx(0);
    setQty(1);
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(
        selectedProduct.variants.find((v) => v.isDefault) || selectedProduct.variants[0]
      );
    } else {
      setSelectedVariant(null);
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const productImages =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.image];

  const currentImage = productImages[activeImageIdx] || productImages[0];

  const isOutOfStock = selectedProduct.stock <= 0;
  const displayPrice = selectedVariant ? selectedVariant.price : selectedProduct.price;
  const displayMrp = selectedVariant ? (selectedVariant.mrp || selectedProduct.mrp) : selectedProduct.mrp;
  const discountPercent = Math.round(((displayMrp - displayPrice) / displayMrp) * 100);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddAndOpenCart = () => {
    addToCart(selectedProduct, qty, selectedVariant);
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
          {/* Left: Product Image Gallery */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-center relative">
            {/* Main Active Image */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200 relative group">
              <img
                src={currentImage}
                alt={selectedProduct.title}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Navigation Arrows if Multiple Images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
                    title="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {activeImageIdx + 1} / {productImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip (Multi-Image Selector) */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white shadow-2xs ${
                      activeImageIdx === idx
                        ? 'border-amber-600 ring-2 ring-amber-500/20 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

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
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {displayMrp > displayPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{displayMrp.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
                {selectedVariant && (
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedVariant.label || selectedVariant.weight}
                  </span>
                )}
              </div>

              {/* Multi-Weight Pack Size Selector (Blinkit / Zepto Style) */}
              {selectedProduct.hasVariants && selectedProduct.variants?.length > 0 && (
                <div className="mb-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Select Pack Quantity:
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      Freshly packed in Vizag Hub
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedProduct.variants.map((v) => {
                      const isSelected = selectedVariant?.weight === v.weight;
                      const varDiscount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
                      return (
                        <button
                          key={v.weight}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2 rounded-xl text-left transition border ${
                            isSelected
                              ? 'border-amber-600 bg-amber-600 text-white shadow-xs ring-2 ring-amber-400/30'
                              : 'border-slate-200 bg-white hover:border-amber-400 text-slate-800 hover:bg-amber-50/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{v.weight}</span>
                            {varDiscount > 0 && (
                              <span
                                className={`text-[9px] font-extrabold px-1 rounded ${
                                  isSelected ? 'bg-amber-700 text-white' : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {varDiscount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-sm font-extrabold">₹{v.price}</span>
                            {v.mrp > v.price && (
                              <span
                                className={`text-[10px] line-through ${
                                  isSelected ? 'text-amber-200' : 'text-slate-400'
                                }`}
                              >
                                ₹{v.mrp}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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

              {/* Vizag Store Pickup & 24hr Window badge */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">Free Store Pickup</p>
                    <p className="text-[10px] text-slate-500">Dwaraka Nagar Hub</p>
                  </div>
                </div>

                <div className="bg-orange-50/60 border border-orange-200/60 rounded-xl p-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">24-Hour Window</p>
                    <p className="text-[10px] text-slate-500">Collect within 24 hrs</p>
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
                    addToCart(selectedProduct, qty, selectedVariant);
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
