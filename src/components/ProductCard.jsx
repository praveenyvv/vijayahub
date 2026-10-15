import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Plus, Minus, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Jumbotail Wholesale Product Card
 * - Clean white card with rounded-xl and subtle border
 * - Top badge area: Wholesale Price / Best Seller / Low Stock
 * - Dynamic variant pack selector recalculating wholesale price and savings MRP instantly
 * - Bold wholesale price (₹X), strikethrough MRP (₹Y), green savings badge ("Save ₹Z (W% OFF)")
 * - Interactive add/quantity controller:
 *   - Default: High-contrast orange "ADD" button
 *   - Transforms on click into compact "-  quantity  +"
 *   - Disabled grey "Out of Stock" button when stock is 0
 */
export default function ProductCard({ product }) {
  const { addToCart, updateCartQuantity, setSelectedProduct, cart } = useStore();

  // Selected weight variant (defaults to isDefault variant or first variant)
  const defaultVar =
    product.variants && product.variants.length > 0
      ? product.variants.find((v) => v.isDefault) || product.variants[0]
      : null;

  const [selectedVariant, setSelectedVariant] = useState(defaultVar);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayMrp = selectedVariant ? (selectedVariant.mrp || product.mrp) : product.mrp;
  const savings = Math.max(0, displayMrp - displayPrice);
  const discountPercent = displayMrp > 0 ? Math.round((savings / displayMrp) * 100) : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Check if this specific item/variant is currently in cart
  const cartKey = selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id;
  const itemInCart = cart.find((item) => (item.cartItemId || item.id) === cartKey);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* ============================================================== */}
      {/* 1. Top Image Container with Badges                             */}
      {/* ============================================================== */}
      <div
        className="relative aspect-4/3 w-full bg-gray-50 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.images?.[0] || product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges Area */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.badge ? (
            <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              {product.badge}
            </span>
          ) : (
            <span className="bg-[#154d28] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              Wholesale Price
            </span>
          )}

          {isLowStock && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs animate-pulse">
              ⚡ Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Top Right: Savings / Discount Pill */}
        {discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Photos Count / Max per Customer */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.images?.length > 1 && (
            <span className="bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
              📷 {product.images.length} Photos
            </span>
          )}
          {(product.maxPerCustomer > 0 || product.max_per_customer > 0) && (
            <span className="bg-rose-700/90 text-white text-[9px] font-black px-2 py-0.5 rounded backdrop-blur-xs uppercase ml-auto">
              Max {product.maxPerCustomer || product.max_per_customer}/shopper
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="absolute inset-x-3 bottom-2 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 shadow-md hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          Quick View
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. Content & Info Section                                      */}
      {/* ============================================================== */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold text-[#154d28] bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-[#154d28] cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          {/* Key Specs Preview (for Appliances) */}
          {product.category === 'Kitchen Appliances' && product.specs && (
            <div className="text-xs text-slate-500 mb-2.5 space-y-0.5 line-clamp-2">
              {product.specs.power && (
                <p className="flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Power: {product.specs.power}
                </p>
              )}
              {product.specs.warranty && (
                <p className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  {product.specs.warranty}
                </p>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* Variant Selector (Weight / Pack Size Chips)                */}
          {/* ========================================================== */}
          {product.hasVariants && product.variants?.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-extrabold text-gray-700">Select Pack Size:</span>
                {selectedVariant && (
                  <span className="text-[#154d28] font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                    {selectedVariant.weight}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.weight === v.weight;
                  return (
                    <button
                      key={v.weight}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={`py-1 px-1 rounded-lg text-center transition-all border ${
                        isSelected
                          ? 'border-[#154d28] bg-[#154d28] text-white font-black shadow-2xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight">{v.weight}</div>
                      <div
                        className={`text-[10px] font-semibold leading-tight ${
                          isSelected ? 'text-amber-200' : 'text-gray-500'
                        }`}
                      >
                        ₹{v.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. Pricing, Savings MRP & Interactive Add Controller           */}
        {/* ============================================================== */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {/* Price & Savings Display */}
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayMrp > displayPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                  ₹{displayMrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Green Savings Badge */}
            {savings > 0 && (
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  <span>Save ₹{savings.toLocaleString('en-IN')}</span>
                  {discountPercent > 0 && (
                    <span className="text-emerald-600 font-extrabold">({discountPercent}% OFF)</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 4. Interactive Quantity Controller / Orange ADD Button        */}
          {/* ============================================================== */}
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center uppercase tracking-wider"
            >
              Out of Stock
            </button>
          ) : itemInCart ? (
            /* Active Stepper (-  quantity  +) */
            <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="text-center px-2">
                <span className="text-sm font-black text-amber-950">
                  {itemInCart.quantity}
                </span>
                <span className="block text-[9px] text-amber-700 font-bold leading-none">
                  in Cart
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity + 1)}
                disabled={itemInCart.quantity >= product.stock}
                className="w-8 h-8 rounded-lg bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95 disabled:opacity-40"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Default High-Contrast Orange "ADD" Button */
            <button
              type="button"
              onClick={() => addToCart(product, 1, selectedVariant)}
              className="w-full py-2.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
