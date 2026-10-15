import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, ShoppingBag, Store, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { matchProductCategory } from './ProductGrid';

const CATEGORY_BANNER_IMAGES = {
  'Rice & Pulses': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  'Rice & Rice Products': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  'Pulses': 'https://images.unsplash.com/photo-1585996746979-379e49a15f00?auto=format&fit=crop&w=1200&q=80',
  'Whole Grains & Dry Fruits': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1200&q=80',
  'Fresh Dry Fruits': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1200&q=80',
  'Dry Fruits': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1200&q=80',
  'Whole Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
  'Flours, Sooji & Sugar': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  'Flours & Sooji': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  'Atta': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  'Sugar, Salt & Jaggery': 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=1200&q=80',
  'Spices & Masalas': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  'Whole Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  'Powdered Spices & Masalas': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=80',
  'Kitchen Appliances': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  'Mixer Grinders': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80',
  'Induction & Stoves': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
};

function getCategoryBannerImage(cat) {
  if (CATEGORY_BANNER_IMAGES[cat]) return CATEGORY_BANNER_IMAGES[cat];
  const catLower = (cat || '').toLowerCase();
  if (catLower.includes('rice') || catLower.includes('pulse') || catLower.includes('dal')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80';
  }
  if (catLower.includes('fruit') || catLower.includes('nut') || catLower.includes('almond') || catLower.includes('cashew')) {
    return 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1200&q=80';
  }
  if (catLower.includes('flour') || catLower.includes('atta') || catLower.includes('sooji') || catLower.includes('sugar')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80';
  }
  if (catLower.includes('spice') || catLower.includes('masala')) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80';
  }
  if (catLower.includes('appliance') || catLower.includes('mixer') || catLower.includes('cooktop')) {
    return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Dedicated Category Page View
 * - Top Sticky Bar: Back Arrow (←), Category Title, Cart icon, and In-Category Search Bar
 * - Category Banner Image: Styled visual card with title & item count pill
 * - Product Listing: Compact 2-column mobile grid
 * - Empty State: "Fresh Stock Arriving Soon! 🌾" with "Explore Home Catalog" orange button
 * - Browser History & Hardware Back Button Integration
 */
export default function CategoryPageView({ onBackToHome }) {
  const {
    selectedCategory,
    setSelectedCategory,
    products,
    cartItemCount,
    setIsCartOpen
  } = useStore();

  const [inCategorySearch, setInCategorySearch] = useState('');

  // Instant scroll to top (y = 0) whenever CategoryPageView mounts or category changes
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    const raf = requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [selectedCategory]);

  // Browser history popstate handler
  useEffect(() => {
    // Push history state when category is active
    if (selectedCategory && selectedCategory !== 'All') {
      try {
        if (!window.history.state || window.history.state.category !== selectedCategory) {
          window.history.pushState(
            { view: 'category', category: selectedCategory },
            '',
            `#category=${encodeURIComponent(selectedCategory)}`
          );
        }
      } catch {
        // ignore history state exceptions in sandboxes
      }
    }

    const handlePopState = (e) => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
      if (!e.state || e.state.view !== 'category') {
        setSelectedCategory('All');
        setInCategorySearch('');
      } else if (e.state.category) {
        setSelectedCategory(e.state.category);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCategory, setSelectedCategory]);

  const handleBack = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (onBackToHome) {
      onBackToHome();
    } else {
      setSelectedCategory('All');
      setInCategorySearch('');
      if (window.history.state?.view === 'category') {
        window.history.back();
      }
    }
  };

  // Filter in-stock only products matching this category and in-category search query
  const categoryProducts = React.useMemo(() => {
    return products.filter((p) => {
      const stockCount = Number(p.stock ?? p.inventory ?? 0);
      if (stockCount <= 0) return false;

      const matchCat = matchProductCategory(p, selectedCategory);
      if (!matchCat) return false;
      if (!inCategorySearch.trim()) return true;

      const q = inCategorySearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, inCategorySearch]);

  const bannerImg = getCategoryBannerImage(selectedCategory);

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col animate-in fade-in duration-200">
      {/* ============================================================== */}
      {/* 1. Dedicated Top Sticky Header Bar (Fixed on Scroll)           */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#154d28] text-white shadow-md select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* Top Row: Back Arrow + Category Title + Cart Icon */}
          <div className="flex items-center justify-between h-14 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                aria-label="Back to Home Catalog"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-sm sm:text-base text-white truncate leading-tight">
                    {selectedCategory}
                  </h1>
                  <span className="text-[10px] bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                    {categoryProducts.length} items
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80 truncate">
                  📍 Dwaraka Nagar Hub • Wholesale
                </p>
              </div>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Bottom Row: In-Category Search Bar */}
          <div className="pb-2.5 pt-0.5">
            <div className="relative flex items-center bg-white rounded-xl shadow-inner border border-emerald-900/30">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={inCategorySearch}
                onChange={(e) => setInCategorySearch(e.target.value)}
                placeholder={`Search inside ${selectedCategory}...`}
                className="w-full py-2 px-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
              {inCategorySearch && (
                <button
                  type="button"
                  onClick={() => setInCategorySearch('')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 mr-1.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. Header Category Banner Image (Visual Context Card)          */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-3 pb-2 w-full">
        <div className="relative h-28 sm:h-36 md:h-44 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <img
            src={bannerImg}
            alt={selectedCategory}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent flex flex-col justify-center p-3.5 sm:p-6 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Wholesale Hub
              </span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'Item Available' : 'Items Available'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-xs">
              {selectedCategory}
            </h2>
            <p className="text-[11px] sm:text-xs text-emerald-200 mt-1 max-w-md hidden sm:block">
              Direct Dwaraka Nagar warehouse rates • Reserved 24 hrs for self-pickup
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. Product Listing or Soothing Empty State                     */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-24 w-full">
        {categoryProducts.length === 0 ? (
          /* Empty Category View */
          <div className="my-8 p-6 sm:p-10 bg-amber-50/70 border border-amber-200/90 rounded-2xl text-center max-w-lg mx-auto shadow-xs animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-3xl shadow-2xs">
              🌾
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1.5">
              Fresh Stock Arriving Soon! 🌾
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 max-w-sm mx-auto">
              We are actively curating and stocking premium items for this category. Check back shortly!
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Explore Home Catalog</span>
              <ArrowLeft className="w-4 h-4 rotate-180 stroke-[3]" />
            </button>
          </div>
        ) : (
          /* Compact 2-Column Mobile Product Grid */
          <div className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
