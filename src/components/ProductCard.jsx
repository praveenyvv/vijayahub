import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Check, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
  const discountPercent = Math.round(((displayMrp - displayPrice) / displayMrp) * 100);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Check if this specific item/variant is in cart
  const cartKey = selectedVariant ? `${product.id}-${selectedVariant.weight}` : product.id;
  const itemInCart = cart.find((item) => (item.cartItemId || item.id) === cartKey);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.images?.[0] || product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Photos Count Badge */}
        {product.images?.length > 1 && (
          <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
            📷 {product.images.length} Photos
          </span>
        )}

        {/* Max Per Customer Limit Badge (Offer Items) */}
        {(product.maxPerCustomer > 0 || product.max_per_customer > 0) && (
          <span className="absolute bottom-2.5 right-2.5 bg-rose-700/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs uppercase tracking-wider">
            Max {product.maxPerCustomer || product.max_per_customer}/user
          </span>
        )}

        {/* Quick View Button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="absolute inset-x-4 bottom-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-md hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          Quick View Specs
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-700 cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          {/* Key Specs Preview (for Appliances) */}
          {product.category === 'Kitchen Appliances' && (
            <div className="text-xs text-slate-500 mb-3 space-y-0.5 line-clamp-2">
              {product.specs?.power && (
                <p className="flex items-center gap-1 font-medium text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Power: {product.specs.power}
                </p>
              )}
              {product.specs?.warranty && (
                <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  {product.specs.warranty}
                </p>
              )}
            </div>
          )}

          {/* Weight Variant Selector (For Dry Fruits / Loose Goods) */}
          {product.hasVariants && product.variants?.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-slate-600">Select Pack Size:</span>
                {selectedVariant && (
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                    {selectedVariant.weight}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
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
                      className={`py-1.5 px-0.5 rounded-lg text-center transition border ${
                        isSelected
                          ? 'border-amber-600 bg-amber-600 text-white font-extrabold shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight">{v.weight}</div>
                      <div
                        className={`text-[9px] font-semibold leading-tight ${
                          isSelected ? 'text-amber-100' : 'text-slate-500'
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

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayMrp > displayPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{displayMrp.toLocaleString('en-IN')}
              </span>
            )}
            {selectedVariant && (
              <span className="text-[11px] text-slate-500 font-medium">
                ({selectedVariant.label || selectedVariant.weight})
              </span>
            )}
          </div>

          {/* Stock state */}
          <div className="mb-3 text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                Out of Stock (Refilling soon)
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded animate-pulse">
                ⚡ Only {product.stock} units ready in Vizag hub!
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock ({product.stock} units ready)
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart or Stepper */}
          {itemInCart ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1">
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 shadow-2xs transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="text-center px-2">
                <span className="text-xs font-bold text-emerald-950">
                  {itemInCart.quantity} in Cart
                </span>
                {selectedVariant && (
                  <span className="block text-[9px] text-emerald-700 font-medium leading-none">
                    ({selectedVariant.weight})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => updateCartQuantity(cartKey, itemInCart.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1, selectedVariant)}
              disabled={isOutOfStock}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25 active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {selectedVariant ? `${selectedVariant.weight}` : ''} to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
