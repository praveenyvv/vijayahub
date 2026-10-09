import React from 'react';
import { X, ShieldCheck, RefreshCw, Truck, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function PolicyModal({ policyType, onClose }) {
  const { storeInfo } = useStore();

  if (!policyType) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base capitalize">
              {policyType === 'refund' && 'Return & Refund Policy'}
              {policyType === 'shipping' && 'Shipping & Delivery Policy'}
              {policyType === 'terms' && 'Terms of Service'}
              {policyType === 'privacy' && 'Privacy Policy'}
              {policyType === 'contact' && 'Contact Us & Store Location'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700 leading-relaxed space-y-4">
          {policyType === 'refund' && (
            <>
              <p className="font-bold text-slate-900 text-sm">
                VijayaHub Return, Replacement & Cancellation Policy:
              </p>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Kitchen Appliances:</h4>
                <p>
                  All kitchen appliances (Mixer Grinders, Induction Cooktops, Gas Stoves, Air Fryers, Electric Kettles) are covered under a <strong>7-Day Replacement Policy</strong> for any verified manufacturing defects or transit damage. Additionally, all appliances carry the respective manufacturer's brand warranty (1 to 2 years) serviceable at authorized service centers in Visakhapatnam.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Fresh Dry Fruits:</h4>
                <p>
                  Due to food safety and hygiene regulations, unopened packets can be replaced if reported within 48 hours of delivery in case of vacuum packaging compromise or transit spillage. Once the seal is broken, dry fruits are non-returnable.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. Refund Processing:</h4>
                <p>
                  Approved refunds are credited back to the original source (UPI, Credit/Debit card, or Bank account) within <strong>3 to 5 business days</strong> through our payment gateway.
                </p>
              </div>
            </>
          )}

          {policyType === 'shipping' && (
            <>
              <p className="font-bold text-slate-900 text-sm">
                Visakhapatnam Local Shipping & Store Pickup Policy:
              </p>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Free Store Pickup:</h4>
                <p>
                  Orders marked for Store Pickup are prepared and kept ready at our Dwaraka Nagar central hub within <strong>30 to 45 minutes</strong> of online placement. Customers can pick up their parcel between 10:00 AM and 8:30 PM (All 7 Days).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Local 20 KM Delivery Radius:</h4>
                <p>
                  We offer direct doorstep delivery across Visakhapatnam (Pincodes: 530001 to 530052, including MVP Colony, Gajuwaka, Dwaraka Nagar, Madhurawada, Seethammadhara, Rushikonda, and Pendurthi).
                </p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><strong>Delivery Time:</strong> Same-day delivery within 2 to 4 hours for orders placed before 5:00 PM.</li>
                  <li><strong>Delivery Fee:</strong> ₹40 flat fee for orders under ₹999. <strong>FREE DELIVERY</strong> on all orders of ₹999 and above.</li>
                </ul>
              </div>
            </>
          )}

          {policyType === 'terms' && (
            <>
              <p className="font-bold text-slate-900 text-sm">VijayaHub Terms of Service:</p>
              <p>
                Welcome to VijayaHub.com. By accessing our platform and placing orders, you agree to our terms of service. All prices displayed are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to cancel any orders placed with fraudulent intent or erroneous pricing. Disputes are subject to the exclusive jurisdiction of the courts of Visakhapatnam, Andhra Pradesh.
              </p>
              <p>
                Product images are illustrative and real packaging may differ based on batch updates by manufacturers.
              </p>
            </>
          )}

          {policyType === 'privacy' && (
            <>
              <p className="font-bold text-slate-900 text-sm">VijayaHub Customer Privacy Policy:</p>
              <p>
                We value your privacy. We collect your name, phone number, delivery address, and email strictly for fulfilling orders and communicating order tracking updates via SMS or WhatsApp.
              </p>
              <p>
                We do NOT store your bank passwords, UPI PINs, or credit card CVVs on our servers. All financial transactions are securely processed through RBI-authorized payment gateways complying with PCI-DSS Level 1 standards.
              </p>
            </>
          )}

          {policyType === 'contact' && (
            <div className="space-y-3">
              <p className="font-bold text-slate-900 text-sm">
                Get in Touch With VijayaHub:
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p><strong>Central Hub:</strong> {storeInfo.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p><strong>Phone / WhatsApp:</strong> {storeInfo.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <p><strong>Email:</strong> {storeInfo.email}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200">
                <p><strong>Store Timings:</strong> 10:00 AM - 8:30 PM (All 7 Days Open)</p>
                <p><strong>Business Registrations:</strong> GSTIN: {storeInfo.gstNumber} | FSSAI: {storeInfo.fssaiNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
