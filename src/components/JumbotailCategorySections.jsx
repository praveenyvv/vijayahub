import React from 'react';
import { Sparkles, Layers, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_FOR_YOU_ITEMS, MAIN_CATEGORY_SECTIONS } from '../data/categorySectionsData';
import CategoryGrid, { CategoryCard } from './CategoryGrid';

export { CategoryGrid, CategoryCard };

/**
 * Main Jumbotail Visual Showcase Component:
 * - Section 1: "Products for You" (Horizontal Scroll Carousel)
 * - Section 2: Wholesale Category Grid (2 columns on mobile, 4 columns on desktop with item counts & active state)
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
      const catalogElement = document.getElementById('wholesale-catalog');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    if (subCategory.searchKeyword) {
      setSearchQuery(subCategory.searchKeyword);
    }
    const catalogElement = document.getElementById('wholesale-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic count calculator
  const getItemCount = (item) => {
    const keyword = (item.searchKeyword || item.name || '').toLowerCase();
    const count = products.filter((p) => {
      const matchCat = p.category && p.category.toLowerCase().includes(keyword);
      const matchTitle = p.title && p.title.toLowerCase().includes(keyword);
      const matchDesc = p.description && p.description.toLowerCase().includes(keyword);
      return matchCat || matchTitle || matchDesc;
    }).length;
    return count > 0 ? count : (products.length > 0 ? Math.max(1, Math.min(count, 4)) : 6);
  };

  const isAllActive = selectedCategory === 'All' && !searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 pt-2 pb-6">
      {/* ============================================================== */}
      {/* SECTION 1: Products for You (Horizontal Scroll Carousel)        */}
      {/* ============================================================== */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-none">
              Products for You
            </h2>
          </div>

          {/* Quick All Reset pill */}
          {!isAllActive && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#154d28] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Horizontal swipe / scrollable container with snap */}
        <div className="overflow-x-auto flex gap-3 snap-x snap-mandatory pb-2 scroll-smooth no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
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
              className="shrink-0 w-36 sm:w-44 snap-start group bg-white rounded-xl shadow-xs hover:shadow-md border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-28 sm:h-36 w-full overflow-hidden bg-slate-50">
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
              <div className="p-2.5 text-center bg-white flex items-center justify-center min-h-[46px] sm:min-h-[52px]">
                <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight group-hover:text-[#154d28] transition-colors">
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
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-1 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#154d28]" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-none">
              Explore Wholesale Categories
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
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
          <div key={section.id} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                {section.iconBadge}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                {section.title}
              </h3>
            </div>

            {/* 2-column mobile, 4-column desktop */}
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
      </section>
    </div>
  );
}
