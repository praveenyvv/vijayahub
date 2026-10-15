import React from 'react';
import { Flame, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Top "Trending / Smart Basket Recommendations" Row
 * - Positioned right above the category grid on Home Screen
 * - Horizontal swipe row showcasing 6-8 fast-moving mixed wholesale items
 * - Features instant 1-Click "ADD" and Stepper buttons so users build cart immediately
 */
export default function TrendingPicksRow() {
  const { products, addToCart, updateCartQuantity, cart, setSelectedProduct } = useStore();

  // Curate 6-8 fast-moving popular items across in-stock Rice, Cashews, Oil, Dal, Almonds, Mixer, etc.
  const trendingProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    // Filter ONLY in-stock products
    const inStockProducts = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) > 0);
    if (inStockProducts.length === 0) return [];

    // Prioritize high-demand daily staples
    const priorityKeywords = ['rice', 'cashew', 'almond', 'oil', 'toor', 'mixer', 'atta', 'walnut'];
    const curated = [];
    const usedIds = new Set();

    for (const kw of priorityKeywords) {
      const match = inStockProducts.find(
        (p) =>
          !usedIds.has(p.id) &&
          (p.title.toLowerCase().includes(kw) ||
            (p.category && p.category.toLowerCase().includes(kw)) ||
            (p.description && p.description.toLowerCase().includes(kw)))
      );
      if (match) {
        curated.push(match);
        usedIds.add(match.id);
      }
      if (curated.length >= 8) break;
    }

    // Fallback: fill up to 6-8 from rest of in-stock products
    if (curated.length < 6) {
      for (const p of inStockProducts) {
        if (!usedIds.has(p.id)) {
          curated.push(p);
          usedIds.add(p.id);
        }
        if (curated.length >= 8) break;
      }
    }

    return curated;
  }, [products]);

  if (trendingProducts.length === 0) return null;

  return (
    <section className="space-y-2.5 pt-1 pb-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>Popular Wholesale Picks</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md">
                Fast Moving
              </span>
            </h2>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">
              Instant Kirana essentials • Quick 1-click add to cart
            </p>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable row with snap */}
      <div className="overflow-x-auto flex gap-2.5 sm:gap-3 snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
        {trendingProducts.map((product) => {
          const defaultVariant =
            product.variants && product.variants.length > 0
              ? product.variants.find((v) => v.isDefault) || product.variants[0]
              : null;

          const price = defaultVariant ? defaultVariant.price : product.price;
          const mrp = defaultVariant ? defaultVariant.mrp || product.mrp : product.mrp;
          const savings = Math.max(0, mrp - price);
          const discountPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;

          const cartKey = defaultVariant ? `${product.id}-${defaultVariant.weight}` : product.id;
          const itemInCart = cart.find((item) => (item.cartItemId || item.id) === cartKey);

          return (
            <div
              key={product.id}
              className="shrink-0 w-38 sm:w-44 snap-start group bg-white rounded-2xl border border-gray-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-2.5 relative"
            >
              {/* Product Thumbnail */}
              <div
                className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-50 rounded-xl cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {discountPercent > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                    {discountPercent}% OFF
                  </span>
                )}

                {defaultVariant && (
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded backdrop-blur-xs">
                    {defaultVariant.weight}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="pt-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 hover:text-[#154d28] cursor-pointer min-h-[2rem]"
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm sm:text-base font-black text-gray-900">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {mrp > price && (
                      <span className="text-[10px] text-gray-400 line-through font-medium">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Add or Quantity Stepper */}
                <div className="pt-2">
                  {itemInCart ? (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-lg p-0.5 shadow-2xs h-7">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(cartKey, itemInCart.quantity - 1)}
                        className="w-6 h-6 rounded bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95 cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-amber-950 px-1">
                        {itemInCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(cartKey, itemInCart.quantity + 1)}
                        disabled={itemInCart.quantity >= product.stock}
                        className="w-6 h-6 rounded bg-white hover:bg-amber-100 flex items-center justify-center font-black text-amber-900 shadow-2xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1, defaultVariant)}
                      className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ADD</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
