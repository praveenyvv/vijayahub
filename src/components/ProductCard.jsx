import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Plus, Minus, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Compact Jumbotail Wholesale Product Card
 * - Designed for 2-column mobile grid view (avoids full-height / giant cards)
 * - Constrained image height (h-28 sm:h-36 md:h-40 max-h-36 sm:max-h-44)
 * - Compact badges, pack selector, wholesale pricing, and orange ADD button
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

  const stockCount = Number(product.stock ?? product.inventory ?? 0);
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  // Check if this specific item/variant is currently in cart
  const cartKey = selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id;
  const itemInCart = cart.find((item) => (item.cartItemId || item.id) === cartKey);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* ============================================================== */}
      {/* 1. Constrained Mobile Image Container (h-28 sm:h-36 md:h-40)   */}
      {/* ============================================================== */}
      <div
        className="relative h-28 sm:h-36 md:h-40 max-h-36 sm:max-h-44 w-full bg-gray-50 overflow-hidden cursor-pointer shrink-0"
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
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
          {product.badge ? (
            <span className="bg-amber-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs uppercase tracking-wider">
              {product.badge}
            </span>
          ) : (
            <span className="bg-[#154d28] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs uppercase tracking-wider flex items-center gap-0.5">
              <Tag className="w-2 h-2" />
              Wholesale
            </span>
          )}

          {isLowStock && (
            <span className="bg-rose-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs animate-pulse">
              ⚡ {product.stock} Left
            </span>
          )}
        </div>

        {/* Top Right: Savings / Discount Pill */}
        {discountPercent > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Quick View Button on Hover (Desktop) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="hidden sm:flex absolute inset-x-2 bottom-1.5 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-1 shadow-md hover:bg-white"
        >
          <Eye className="w-3 h-3 text-amber-600" />
          Quick View
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. Compact Info Section                                        */}
      {/* ============================================================== */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span className="font-bold text-[#154d28] bg-emerald-50 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] truncate max-w-[90px]">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-slate-700 font-bold text-[10px]">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-[#154d28] cursor-pointer transition-colors mb-1.5 min-h-[2rem]"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Compact Variant Selector (Weight / Pack Chips) */}
          {product.hasVariants && product.variants?.length > 0 && (
            <div className="mb-2">
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {product.variants.slice(0, 3).map((v) => {
                  const isSelected = selectedVariant?.weight === v.weight;
                  return (
                    <button
                      key={v.weight}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={`py-0.5 px-0.5 rounded text-center transition-all border ${
                        isSelected
                          ? 'border-[#154d28] bg-[#154d28] text-white font-black shadow-2xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-[9px] font-bold leading-tight truncate">{v.weight}</div>
                      <div
                        className={`text-[8px] font-semibold leading-tight ${
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
        {/* 3. Pricing & Compact ADD / Stepper Button                     */}
        {/* ============================================================== */}
        <div className="pt-1.5 border-t border-gray-100 space-y-1.5">
          {/* Price & Savings MRP */}
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayMrp > displayPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                  ₹{displayMrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Savings Pill */}
            {savings > 0 && (
              <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                Save ₹{savings}
              </span>
            )}
          </div>

          {/* Interactive ADD / Quantity Controller */}
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-xs bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center uppercase tracking-wider"
            >
              Out of Stock
            </button>
          ) : itemInCart ? (
            /* Active Stepper (-  quantity  +) */
            <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-lg p-0.5 shadow-2xs h-7 sm:h-8">
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity - 1)}
                className="w-6 h-6 rounded bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="text-center px-1">
                <span className="text-xs font-black text-amber-950">
                  {itemInCart.quantity}
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity + 1)}
                disabled={itemInCart.quantity >= product.stock}
                className="w-6 h-6 rounded bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95 disabled:opacity-40"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Default High-Contrast Orange "ADD" Button */
            <button
              type="button"
              onClick={() => addToCart(product, 1, selectedVariant)}
              className="w-full py-1.5 sm:py-2 px-3 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center gap-1 shadow-xs transition-all duration-150 active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
