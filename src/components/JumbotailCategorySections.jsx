import React from 'react';
import { Sparkles, Layers, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_FOR_YOU_ITEMS, MAIN_CATEGORY_SECTIONS } from '../data/categorySectionsData';
import CategoryGrid, { CategoryCard } from './CategoryGrid';
import { matchProductCategory } from './ProductGrid';

export { CategoryGrid, CategoryCard };

/**
 * Main Jumbotail Visual Showcase Component:
 * - Section 1: "Products for You" (Horizontal Scroll Carousel)
 * - Section 2: Wholesale Category Grid (Dedicated filtering without jump-scroll)
 */
export default function JumbotailCategorySections() {
  const { setSelectedProduct, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, products } = useStore();

  const handleProductForYouClick = (item) => {
    const found =
      products.find((p) => p.id === item.productId) ||
      products.find((p) => p.title.toLowerCase().includes(item.searchKeyword.toLowerCase()));

    if (found) {
      setSelectedProduct(found);
    } else if (item.searchKeyword) {
      setSearchQuery(item.searchKeyword);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    // Immediate dedicated category filter without jump-scrolling
    setSelectedCategory(subCategory.name);
    setSearchQuery('');
  };

  // Dynamic count calculator
  const getItemCount = (item) => {
    return products.filter((p) => matchProductCategory(p, item.name) || matchProductCategory(p, item.searchKeyword)).length;
  };

  const isAllActive = selectedCategory === 'All' && !searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-4 pt-1 pb-4">
      {/* ============================================================== */}
      {/* SECTION 1: Products for You (Horizontal Scroll Carousel)        */}
      {/* ============================================================== */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400" />
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight leading-none">
              Products for You
            </h2>
          </div>

          {!isAllActive && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#154d28] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Horizontal swipe container */}
        <div className="overflow-x-auto flex gap-2 sm:gap-3 snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          {PRODUCTS_FOR_YOU_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleProductForYouClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductForYouClick(item);
                }
              }}
              className="shrink-0 w-32 sm:w-40 snap-start group bg-white rounded-xl shadow-xs hover:shadow-md border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-24 sm:h-32 w-full overflow-hidden bg-slate-50 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="p-2 text-center bg-white flex items-center justify-center min-h-[40px] sm:min-h-[46px]">
                <span className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight group-hover:text-[#154d28] transition-colors truncate">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: Category Sections (2-Col Mobile, 4-Col Desktop)     */}
      {/* ============================================================== */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#154d28]" />
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight leading-none">
              Explore Wholesale Categories
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              isAllActive
                ? 'bg-[#154d28] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#154d28]'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>All Categories</span>
          </button>
        </div>

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

            {/* 2-column mobile, 4-column desktop */}
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
      </section>
    </div>
  );
}
