import React from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, cart } = useStore();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Check if item is already in cart
  const itemInCart = cart.find((item) => item.id === product.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback placeholder if unsplash fails
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

          {/* Key Specs Preview */}
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
            {product.specs?.packWeight && (
              <p className="flex items-center gap-1 font-medium text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Net Weight: {product.specs.packWeight}
              </p>
            )}
            {product.specs?.grade && (
              <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                Quality: {product.specs.grade}
              </p>
            )}
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
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
                ⚡ Only {product.stock} left in Vizag hub!
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock ({product.stock} units ready)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : itemInCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25 active:scale-[0.98]'
            }`}
          >
            {itemInCart ? (
              <>
                <Check className="w-4 h-4" /> Added ({itemInCart.quantity} in Cart)
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
