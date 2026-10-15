import React from 'react';
import { Layers, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MAIN_CATEGORY_SECTIONS } from '../data/categorySectionsData';
import { matchProductCategory } from './ProductGrid';

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
      {/* Visual Photo (65-70% height) */}
      <div className="relative h-24 sm:h-32 md:h-36 w-full overflow-hidden bg-slate-50 shrink-0">
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
        <span className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full backdrop-blur-xs shadow-xs">
          {count} {count === 1 ? 'Item' : 'Items'}
        </span>

        {/* Active Check Indicator */}
        {isActive && (
          <span className="absolute top-1.5 left-1.5 bg-[#154d28] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-300" />
            Active
          </span>
        )}
      </div>

      {/* Crisp White Container with Bold Typography */}
      <div className={`p-2 text-center flex items-center justify-center min-h-[42px] sm:min-h-[48px] ${
        isActive ? 'bg-emerald-50/60' : 'bg-white'
      }`}>
        <span className={`text-[11px] sm:text-xs md:text-sm font-bold leading-tight transition-colors line-clamp-1 ${
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
 * - Sets dedicated category filter immediately without page jump-scrolling
 * - "All Categories" reset pill tag for fast navigation
 * - Dynamic product counts calculated per category
 */
export default function CategoryGrid() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  // Helper to compute item counts dynamically matching each category
  const getItemCount = (item) => {
    return products.filter((p) => matchProductCategory(p, item.name) || matchProductCategory(p, item.searchKeyword)).length;
  };

  const handleSubCategoryClick = (subCategory) => {
    // Immediately filter by category without any jump-scrolling
    setSelectedCategory(subCategory.name);
    setSearchQuery('');
  };

  const handleResetAll = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const isAllActive = selectedCategory === 'All' && !searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-4 pt-1 pb-3">
      {/* Top Bar with "All Categories" Reset Pill Tag */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-gray-200">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-[#154d28] border border-emerald-200 flex items-center justify-center text-xs sm:text-sm font-bold shadow-2xs">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight leading-tight">
              Wholesale Categories
            </h2>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
              Direct Dwaraka Nagar Hub inventory • {products.length} Products
            </p>
          </div>
        </div>

        {/* All Categories Reset Pill Tag */}
        <button
          type="button"
          onClick={handleResetAll}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isAllActive
              ? 'bg-[#154d28] text-white shadow-emerald-950/20'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50 hover:text-[#154d28] hover:border-[#154d28]'
          }`}
        >
          <RotateCcw className={`w-3 h-3 ${isAllActive ? 'text-emerald-200' : 'text-gray-400'}`} />
          <span>All Categories</span>
          <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
            isAllActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {products.length}
          </span>
        </button>
      </div>

      {/* Category Sections: 2-Col Mobile (grid-cols-2), 4-Col Desktop */}
      <div className="space-y-4 sm:space-y-6">
        {MAIN_CATEGORY_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                {section.iconBadge}
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 tracking-tight">
                {section.title}
              </h3>
            </div>

            {/* 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {section.subCategories.map((subCategory) => {
                const count = getItemCount(subCategory);
                const isActive =
                  selectedCategory === subCategory.name ||
                  (selectedCategory !== 'All' &&
                    (subCategory.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                     selectedCategory.toLowerCase().includes(subCategory.name.toLowerCase())));

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
