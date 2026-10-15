import React from 'react';
import { Sparkles, RotateCcw, PackageOpen, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

/**
 * Helper to match products against selected category or search query
 */
export function matchProductCategory(product, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'All') return true;

  const catLower = (product.category || '').toLowerCase();
  const titleLower = (product.title || '').toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  const target = selectedCategory.toLowerCase();

  // Direct category match
  if (catLower === target) return true;

  // Specific subcategory keyword mappings
  if (target.includes('rice')) {
    return catLower.includes('rice') || titleLower.includes('rice');
  }
  if (target.includes('pulse') || target === 'dal' || target.includes('toor')) {
    return catLower.includes('pulse') || titleLower.includes('dal') || titleLower.includes('toor');
  }
  if (target.includes('dry fruit') || target.includes('nut') || target.includes('almond') || target.includes('cashew')) {
    return catLower.includes('dry fruit') || titleLower.includes('almond') || titleLower.includes('cashew') || titleLower.includes('walnut') || titleLower.includes('fig') || titleLower.includes('raisin');
  }
  if (target.includes('grain') || target.includes('wheat')) {
    return catLower.includes('grain') || titleLower.includes('wheat') || descLower.includes('grain');
  }
  if (target.includes('flour') || target.includes('atta') || target.includes('sooji')) {
    return catLower.includes('flour') || titleLower.includes('atta') || titleLower.includes('sooji');
  }
  if (target.includes('oil') || target.includes('ghee')) {
    return catLower.includes('oil') || titleLower.includes('oil') || titleLower.includes('ghee');
  }
  if (target.includes('spice') || target.includes('masala')) {
    return catLower.includes('spice') || titleLower.includes('masala') || titleLower.includes('chilli') || titleLower.includes('turmeric');
  }
  if (target.includes('appliance') || target.includes('mixer') || target.includes('grinder') || target.includes('stove')) {
    return catLower.includes('appliance') || titleLower.includes('mixer') || titleLower.includes('cooktop') || titleLower.includes('fryer') || titleLower.includes('grinder');
  }
  if (target.includes('sugar') || target.includes('salt') || target.includes('jaggery')) {
    return titleLower.includes('sugar') || titleLower.includes('salt') || titleLower.includes('jaggery');
  }

  return catLower.includes(target) || titleLower.includes(target) || descLower.includes(target);
}

/**
 * Dedicated Product Catalog Grid with:
 * - Immediate category filtering without jump-scrolling
 * - Warm & soothing empty category banner when items = 0
 * - Compact 2-column mobile card layout (avoiding oversized single-image cards)
 */
export default function ProductGrid() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // In-stock only filter: hide out-of-stock products
      const stockCount = Number(p.stock ?? p.inventory ?? 0);
      if (stockCount <= 0) return false;

      const matchesCategory = matchProductCategory(p, selectedCategory);
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const isFiltered = selectedCategory !== 'All' || Boolean(searchQuery);

  return (
    <section id="wholesale-catalog" className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-2 pb-8">
      {/* ============================================================== */}
      {/* 1. Header with Active Filter & Quick Reset                     */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 gap-2">
        <div>
          <h2 className="text-sm sm:text-lg md:text-xl font-black text-gray-900 tracking-tight leading-tight">
            {searchQuery
              ? `Search: "${searchQuery}"`
              : selectedCategory === 'All'
              ? 'All Wholesale Products'
              : selectedCategory}
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available at Dwaraka Nagar hub
          </p>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-bold text-[#154d28] hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors border border-emerald-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to All</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. Warm & Soothing Empty Category Banner                       */}
      {/* ============================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="my-6 p-6 sm:p-8 bg-amber-50/70 border border-amber-200/90 rounded-2xl text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-2xs">
            🌾
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1.5">
            Fresh Stock Arriving Soon! 🌾
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 max-w-md mx-auto">
            We are actively curating and stocking new wholesale items for this category. Check back shortly or explore our available products below.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#154d28] hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* ============================================================== */
        /* 3. Compact 2-Column Mobile Grid Layout (grid-cols-2)           */
        /* ============================================================== */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
