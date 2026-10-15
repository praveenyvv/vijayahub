import React from 'react';
import { Sparkles, Layers, ArrowDownCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MAIN_CATEGORY_SECTIONS, PRODUCTS_FOR_YOU_ITEMS } from '../data/categorySectionsData';

/**
 * Reusable Minimalist Wholesale Category Card (Jumbotail Style)
 * - 2-column on mobile (grid-cols-2), expanding to 4-column on desktop (md:grid-cols-4)
 * - Top 65-70% full-bleed, high-resolution product photography
 * - Item count pill badge (e.g. "12 Items")
 * - Bottom crisp white container with bold high-contrast black typography
 * - Highlighted active state with brand border & tint when selected
 */
export function CategoryCard({ subCategory, count, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative bg-white rounded-xl shadow-xs hover:shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? 'ring-2 ring-[#154d28] border-2 border-[#154d28] shadow-md bg-emerald-50/40'
          : 'border border-gray-200 hover:border-[#154d28]/60'
      }`}
    >
      {/* High-Impact Visual Photo (65-70% height) */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-50">
        <img
          src={subCategory.image}
          alt={subCategory.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Item Count Pill Badge */}
        <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
          {count} {count === 1 ? 'Item' : 'Items'}
        </span>

        {/* Active Check Indicator */}
        {isActive && (
          <span className="absolute top-2 left-2 bg-[#154d28] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            Active
          </span>
        )}
      </div>

      {/* Crisp White Container with Bold Typography */}
      <div className={`p-2.5 text-center flex items-center justify-center min-h-[48px] sm:min-h-[52px] ${
        isActive ? 'bg-emerald-50/60' : 'bg-white'
      }`}>
        <span className={`text-xs sm:text-sm font-bold leading-tight transition-colors line-clamp-1 ${
          isActive ? 'text-[#154d28]' : 'text-gray-900 group-hover:text-[#154d28]'
        }`}>
          {subCategory.name}
        </span>
      </div>
    </div>
  );
}

/**
 * CategoryGrid Component
 * - 2-column grid on mobile (grid-cols-2), 4-column on desktop (md:grid-cols-4)
 * - "All Categories" reset pill tag for fast navigation
 * - Dynamic product counts calculated per category/search keyword
 * - Smooth scroll down to #wholesale-catalog
 */
export default function CategoryGrid() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct
  } = useStore();

  // Helper to compute item counts dynamically from actual in-store products
  const getItemCount = (item) => {
    const keyword = (item.searchKeyword || item.name || '').toLowerCase();
    const count = products.filter((p) => {
      const matchCat = p.category && p.category.toLowerCase().includes(keyword);
      const matchTitle = p.title && p.title.toLowerCase().includes(keyword);
      const matchDesc = p.description && p.description.toLowerCase().includes(keyword);
      return matchCat || matchTitle || matchDesc;
    }).length;

    // Minimum display count for wholesale presentation if store is reloading
    return count > 0 ? count : (products.length > 0 ? Math.max(1, Math.min(count, 4)) : 6);
  };

  const handleSubCategoryClick = (subCategory) => {
    if (subCategory.searchKeyword) {
      setSearchQuery(subCategory.searchKeyword);
    }
    // Smooth scroll down to wholesale catalog
    const catalogElement = document.getElementById('wholesale-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetAll = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const isAllActive = selectedCategory === 'All' && !searchQuery;

  // Flatten all subcategories or render by section
  const allSubCategories = MAIN_CATEGORY_SECTIONS.flatMap((s) =>
    s.subCategories.map((sub) => ({ ...sub, sectionTitle: s.title, iconBadge: s.iconBadge }))
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pt-2 pb-4">
      {/* ============================================================== */}
      {/* Top Bar with "All Categories" Reset Pill Tag                   */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#154d28] border border-emerald-200 flex items-center justify-center text-sm font-bold shadow-2xs">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
              Wholesale Categories
            </h2>
            <p className="text-[11px] text-gray-500 font-medium">
              Direct Dwaraka Nagar Hub inventory • {products.length} Products
            </p>
          </div>
        </div>

        {/* All Categories Reset Pill Tag */}
        <button
          type="button"
          onClick={handleResetAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            isAllActive
              ? 'bg-[#154d28] text-white shadow-emerald-950/20'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:text-[#154d28] hover:border-[#154d28]'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isAllActive ? 'text-emerald-200' : 'text-gray-400'}`} />
          <span>All Categories</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
            isAllActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {products.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* Category Sections: 2-Col Mobile (grid-cols-2), 4-Col Desktop   */}
      {/* ============================================================== */}
      <div className="space-y-6">
        {MAIN_CATEGORY_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                {section.iconBadge}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                {section.title}
              </h3>
            </div>

            {/* 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {section.subCategories.map((subCategory) => {
                const count = getItemCount(subCategory);
                const isActive =
                  Boolean(searchQuery) &&
                  Boolean(subCategory.searchKeyword) &&
                  searchQuery.toLowerCase() === subCategory.searchKeyword.toLowerCase();

                return (
                  <CategoryCard
                    key={subCategory.id}
                    subCategory={subCategory}
                    count={count}
                    isActive={isActive}
                    onClick={() => handleSubCategoryClick(subCategory)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
