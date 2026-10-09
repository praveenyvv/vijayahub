import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer({ onOpenPolicy }) {
  const { storeInfo, setIsAdminMode } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                VH
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Vijaya<span className="text-amber-500">Hub</span>.com
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visakhapatnam's direct-to-consumer store for wholesale-rate dry fruits and genuine branded kitchen appliances. Direct from warehouse to your doorstep.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p><strong>FSSAI Lic:</strong> {storeInfo.fssaiNumber}</p>
              <p><strong>GSTIN:</strong> {storeInfo.gstNumber}</p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-amber-400 transition-colors cursor-pointer">
                🍳 Mixer Grinders & Juicers
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">
                🔥 Induction Cooktops & Gas Stoves
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">
                🍟 Air Fryers & Electric Kettles
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">
                🥜 Premium Cashews & Almonds
              </li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">
                🍇 Kashmiri Walnuts & Afghani Figs
              </li>
            </ul>
          </div>

          {/* Mandatory Compliance & Policies */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">
              Customer Support & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenPolicy('refund')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Return & Refund Policy (7 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  20 KM Shipping & Pickup Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Customer Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('contact')}
                  className="hover:text-amber-400 transition-colors text-left font-semibold text-amber-300"
                >
                  Contact Us & Store Location
                </button>
              </li>
            </ul>
          </div>

          {/* Store Location */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">
              Vizag Central Hub
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{storeInfo.address}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{storeInfo.phone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{storeInfo.email}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAdminMode(true)}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Store Owner / Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} VijayaHub.com — All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built for Visakhapatnam D2C Growth</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Zero Middlemen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
