import React from 'react';
import { Truck, Store, ShieldCheck, Zap, Percent, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function HeroBanner() {
  const { selectedCategory, setSelectedCategory, products, categories } = useStore();

  return (
    <section className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-6 pb-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl border border-amber-500/20">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-orange-600/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Vizag Direct Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Visakhapatnam Local D2C • Direct Warehouse Pricing</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
              Cut Out The Middlemen. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
                Premium Dry Fruits & Kitchen Appliances.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              Buy directly from our Vizag central hub at genuine wholesale rates. Reserve your items online and enjoy 
              <strong className="text-white"> Free Store Pickup</strong> at Dwaraka Nagar within your selected 
              <strong className="text-white"> 24-Hour Pickup Window</strong>!
            </p>

            {/* Key Value Propositions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Free Store Pickup</p>
                  <p className="text-[10px] text-slate-400">Dwaraka Nagar Hub</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">24-Hour Window</p>
                  <p className="text-[10px] text-slate-400">Reserved for 24 hrs</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Direct Savings</p>
                  <p className="text-[10px] text-slate-400">Up to 40% below retail</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">100% Genuine</p>
                  <p className="text-[10px] text-slate-400">FSSAI & Brand Warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Dynamically Renders All Admin-Created Categories) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
              Category:
            </span>

            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Showing <strong className="text-slate-800">{products.length}</strong> items in Vizag inventory
          </div>
        </div>
      </div>
    </section>
  );
}
