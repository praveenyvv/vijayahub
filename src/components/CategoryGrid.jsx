import React from 'react';
import { Layers, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MAIN_CATEGORY_SECTIONS } from '../data/categorySectionsData';
import { matchProductCategory } from './ProductGrid';

/**
 * Reusable Minimalist Wholesale Category Card (Jumbotail Style)
 * - Elevated rounded-2xl container with subtle drop shadow
 * - Aspect ratio closer to 4:3 (h-36 sm:h-44 md:h-52)
 * - Card title: text-sm font-semibold text-gray-800 (clean contrast against bold section header)
 * - In-stock only count pill badge
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
      className={`group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? 'ring-2 ring-[#154d28] border-2 border-[#154d28] shadow-md bg-emerald-50/40'
          : 'hover:border-[#154d28]/60'
      }`}
    >
      {/* Category Photography (4:3 aspect ratio, comfortable height) */}
      <div className="relative h-36 sm:h-44 md:h-52 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={subCategory.image}
          alt={subCategory.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* In-Stock Item Count Pill Badge */}
        <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
          {count} {count === 1 ? 'In Stock' : 'In Stock'}
        </span>

        {/* Active Check Indicator */}
        {isActive && (
          <span className="absolute top-2 left-2 bg-[#154d28] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            Active
          </span>
        )}
      </div>

      {/* Crisp White Container with Sub-Category Card Title (text-sm font-semibold text-gray-800) */}
      <div className={`p-3 text-center flex items-center justify-center min-h-[50px] sm:min-h-[56px] ${
        isActive ? 'bg-emerald-50/60' : 'bg-white'
      }`}>
        <span className={`text-sm font-semibold transition-colors line-clamp-1 ${
          isActive ? 'text-[#154d28] font-bold' : 'text-gray-800 group-hover:text-[#154d28]'
        }`}>
          {subCategory.name}
        </span>
      </div>
    </div>
  );
}

/**
 * CategoryGrid Component
 * - Main Section Headings: text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2
 * - In-stock only item badge counting
 * - 2-column grid on mobile (grid-cols-2), 4-column on desktop (md:grid-cols-4)
 * - Instant scroll reset to top (y = 0) upon category selection
 */
export default function CategoryGrid() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  // In-stock only item count per category
  const getItemCount = (item) => {
    return products.filter((p) => {
      const stock = Number(p.stock ?? p.inventory ?? 0);
      return stock > 0 && (matchProductCategory(p, item.name) || matchProductCategory(p, item.searchKeyword));
    }).length;
  };

  const totalInStock = products.filter((p) => Number(p.stock ?? p.inventory ?? 0) > 0).length;

  const handleSubCategoryClick = (subCategory) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    setSelectedCategory(subCategory.name);
    setSearchQuery('');
  };

  const handleResetAll = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
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
              Direct Dwaraka Nagar Hub inventory • {totalInStock} In-Stock Products
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
            {totalInStock}
          </span>
        </button>
      </div>

      {/* Category Sections: Prominent Heading Hierarchy & Elevated 4:3 Cards */}
      <div className="space-y-6 sm:space-y-8">
        {MAIN_CATEGORY_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-3">
            {/* Main Section Heading: text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-sm font-bold shrink-0">
                {section.iconBadge}
              </span>
              <span>{section.title}</span>
            </h3>

            {/* 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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
