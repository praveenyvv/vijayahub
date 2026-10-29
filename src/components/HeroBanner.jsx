import React from 'react';
import { Store, ShieldCheck, Zap, Percent } from 'lucide-react';

export default function HeroBanner() {

  return (
    <section className="bg-gradient-to-b from-emerald-900/10 via-emerald-800/5 to-transparent pt-3 pb-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0d381c] via-[#154d28] to-slate-950 text-white p-5 sm:p-8 shadow-xl border border-emerald-600/30">
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
      </div>
    </section>
  );
}
