import React from 'react';
import { Star, Sparkles, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function JumbotailCategorySections() {
  const { setSelectedProduct, setSelectedCategory, products } = useStore();

  // Helper to find a product by ID or title match
  const findProduct = (id, fallbackKeyword) => {
    return (
      products.find((p) => p.id === id) ||
      products.find((p) => p.title.toLowerCase().includes(fallbackKeyword.toLowerCase())) ||
      products[0]
    );
  };

  const cashews = findProduct('prod-df-1', 'cashew');
  const almonds = findProduct('prod-df-2', 'almond');
  const preethiMixer = findProduct('prod-ka-1', 'preethi');
  const induction = findProduct('prod-ka-2', 'induction');
  const anjeer = findProduct('prod-df-3', 'anjeer');
  const pistachios = findProduct('prod-df-4', 'pistachio');
  const cardamom = findProduct('prod-df-5', 'cardamom');
  const airFryer = findProduct('prod-ka-3', 'air fryer');
  const gasStove = findProduct('prod-ka-4', 'gas stove');
  const kettle = findProduct('prod-ka-5', 'kettle');

  // Curated Jumbotail-style sections
  const sections = [
    {
      id: 'for-you',
      badge: '⭐',
      title: 'Products for You',
      subtitle: 'Best selling wholesale essentials in Vizag',
      items: [
        {
          name: 'Steamed Cashews W-240',
          image: cashews?.images?.[0] || cashews?.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
          product: cashews,
          price: cashews?.price
        },
        {
          name: 'California Almonds',
          image: almonds?.images?.[0] || almonds?.image || 'https://images.unsplash.com/photo-1508061252445-535e574afab5?auto=format&fit=crop&w=600&q=80',
          product: almonds,
          price: almonds?.price
        },
        {
          name: 'Preethi 750W Mixer',
          image: preethiMixer?.images?.[0] || preethiMixer?.image || 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
          product: preethiMixer,
          price: preethiMixer?.price
        },
        {
          name: 'Pigeon Induction Stove',
          image: induction?.images?.[0] || induction?.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
          product: induction,
          price: induction?.price
        }
      ]
    },
    {
      id: 'dry-fruits',
      badge: '🌾',
      title: 'Dry Fruits & Nuts',
      subtitle: 'Direct from wholesale mandi • FSSAI certified',
      categoryFilter: 'Dry Fruits & Nuts',
      items: [
        {
          name: 'Whole Cashews W-240',
          image: cashews?.images?.[0] || cashews?.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
          product: cashews
        },
        {
          name: 'California Almonds',
          image: almonds?.images?.[0] || almonds?.image || 'https://images.unsplash.com/photo-1508061252445-535e574afab5?auto=format&fit=crop&w=600&q=80',
          product: almonds
        },
        {
          name: 'Afghani Anjeer (Figs)',
          image: anjeer?.images?.[0] || anjeer?.image || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
          product: anjeer
        },
        {
          name: 'Salted Roasted Pistas',
          image: pistachios?.images?.[0] || pistachios?.image || 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80',
          product: pistachios
        }
      ]
    },
    {
      id: 'appliances',
      badge: '⚡',
      title: 'Kitchen Appliances',
      subtitle: '100% Genuine brand warranty & GST bill',
      categoryFilter: 'Kitchen Appliances',
      items: [
        {
          name: 'Mixer Grinders',
          image: preethiMixer?.images?.[0] || preethiMixer?.image || 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
          product: preethiMixer
        },
        {
          name: 'Induction Cooktops',
          image: induction?.images?.[0] || induction?.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
          product: induction
        },
        {
          name: 'Digital Air Fryers',
          image: airFryer?.images?.[0] || airFryer?.image || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
          product: airFryer
        },
        {
          name: 'Gas Stoves & Cookers',
          image: gasStove?.images?.[0] || gasStove?.image || 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
          product: gasStove
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pt-3 pb-4">
      {sections.map((section) => (
        <section key={section.id} className="px-3 sm:px-6 max-w-7xl mx-auto">
          {/* Jumbotail Section Title Bar */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white text-slate-800 shadow-2xs border border-slate-200/80 flex items-center justify-center text-xs font-bold shrink-0">
                {section.badge}
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 hidden xs:block">
                    {section.subtitle}
                  </p>
                )}
              </div>
            </div>

            {section.categoryFilter && (
              <button
                type="button"
                onClick={() => setSelectedCategory(section.categoryFilter)}
                className="text-[11px] font-bold text-[#154d28] hover:text-emerald-900 flex items-center gap-0.5 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Jumbotail 2-Column Responsive Card Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.product) {
                    setSelectedProduct(item.product);
                  } else if (section.categoryFilter) {
                    setSelectedCategory(section.categoryFilter);
                  }
                }}
                className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-emerald-600/60 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col active:scale-[0.98]"
              >
                {/* Photo Top Container (covers ~75% like Jumbotail) */}
                <div className="relative aspect-4/3 sm:aspect-16/11 w-full bg-slate-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {item.price && (
                    <span className="absolute bottom-1.5 right-1.5 bg-[#154d28] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                      ₹{item.price}
                    </span>
                  )}
                </div>

                {/* Bottom White Label (clean, centered, bold) */}
                <div className="bg-white py-2 px-2 sm:py-2.5 flex items-center justify-center min-h-[42px] border-t border-slate-100">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 text-center leading-tight line-clamp-1 group-hover:text-[#154d28] transition-colors">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
