import React from 'react';
import { Layers, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MAIN_CATEGORY_SECTIONS } from '../data/categorySectionsData';
import CategoryGrid, { CategoryCard } from './CategoryGrid';
import { matchProductCategory } from './ProductGrid';
import TrendingPicksRow from './TrendingPicksRow';

export { CategoryGrid, CategoryCard, TrendingPicksRow };

/**
 * Main Jumbotail Visual Showcase Component:
 * - Section 1: "🔥 Popular Wholesale Picks" (Top Trending Horizontal Row with instant 1-Click ADD)
 * - Section 2: Jumbotail Elevated Category Grid with Clear Section Hierarchy (text-lg sm:text-xl font-bold)
 */
export default function JumbotailCategorySections() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, products } = useStore();

  const handleSubCategoryClick = (subCategory) => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    setSelectedCategory(subCategory.name);
    setSearchQuery('');
  };

  // In-stock only item count per category
  const getItemCount = (item) => {
    return products.filter((p) => {
      const stock = Number(p.stock ?? p.inventory ?? 0);
      return stock > 0 && (matchProductCategory(p, item.name) || matchProductCategory(p, item.searchKeyword));
    }).length;
  };

  const isAllActive = selectedCategory === 'All' && !searchQuery;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-5 pt-1 pb-4">
      {/* ============================================================== */}
      {/* SECTION 1: Top "Trending / Smart Basket Recommendations" Row   */}
      {/* ============================================================== */}
      <TrendingPicksRow />

      {/* ============================================================== */}
      {/* SECTION 2: Category Sections (Prominent Heading Hierarchy)     */}
      {/* ============================================================== */}
      <section className="space-y-6 sm:space-y-8">
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
              try {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              } catch {
                window.scrollTo(0, 0);
              }
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
          <div key={section.id} className="space-y-3">
            {/* Main Section Heading: text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-white text-slate-800 shadow-2xs border border-gray-200 flex items-center justify-center text-sm font-bold shrink-0">
                {section.iconBadge}
              </span>
              <span>{section.title}</span>
            </h3>

            {/* 2-column mobile, 4-column desktop with generous breathing room */}
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
      </section>
    </div>
  );
}
