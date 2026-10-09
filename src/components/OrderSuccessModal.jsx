import React from 'react';
import { X, CheckCircle2, Clock, PackageCheck, Truck, Store, FileText, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderSuccessModal() {
  const { completedOrder, setCompletedOrder, setInvoiceOrder, storeInfo } = useStore();

  if (!completedOrder) return null;

  const isPickup = completedOrder.fulfillmentType === 'pickup';

  // Status mapping to steps
  const steps = [
    { label: 'Order Placed', desc: 'Received in Vizag Hub' },
    { label: 'Packed & Invoiced', desc: 'Verified & Sealed' },
    { label: isPickup ? 'Ready for Pickup' : 'Out for Delivery', desc: isPickup ? 'At Dwaraka Nagar' : 'With local rider' },
    { label: isPickup ? 'Collected' : 'Delivered', desc: 'Completed' }
  ];

  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Packed':
        return 1;
      case 'Out for Delivery':
      case 'Ready for Pickup':
        return 2;
      case 'Completed':
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getActiveStepIndex(completedOrder.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Order Confirmed!</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Order ID: <strong className="text-white font-mono">{completedOrder.id}</strong>
          </p>
          <span className="inline-block mt-2 bg-emerald-800/60 text-emerald-100 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            {isPickup ? 'Store Pickup: Dwaraka Nagar Central Hub' : 'Local 20 KM Delivery in Visakhapatnam'}
          </span>

          <button
            onClick={() => setCompletedOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Order Tracker */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Status Tracking:
              </h3>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Current: {completedOrder.status}
              </span>
            </div>

            {/* Tracker Step Indicators */}
            <div className="relative grid grid-cols-4 gap-2 pt-2">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold leading-tight ${
                        isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 hidden sm:block">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fulfillment Instructions Card */}
          {isPickup ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Store className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950 mb-0.5">
                    How To Collect Your Order:
                  </p>
                  <p className="text-amber-900 text-[11px] leading-relaxed mb-2">
                    Visit {storeInfo.name} at {storeInfo.address}. Please show your Order ID{' '}
                    <strong className="font-mono text-amber-950">{completedOrder.id}</strong> to the manager.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-amber-800 font-semibold">
                    <span>⏰ Hours: {storeInfo.workingHours}</span>
                    <span>📞 {storeInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-orange-950 mb-0.5">
                    Doorstep Delivery Instructions:
                  </p>
                  <p className="text-orange-900 text-[11px] leading-relaxed">
                    Delivering to: <strong>{completedOrder.customer.address}</strong> (Pincode: {completedOrder.customer.pincode}). Our local delivery rider will contact your mobile number {completedOrder.customer.phone} shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Purchased Items List */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
              Items In This Order:
            </h4>
            {completedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span className="font-medium">
                  {item.quantity}x {item.title}
                </span>
                <span className="font-bold text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}

            <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Paid ({completedOrder.paymentMethod}):</span>
              <span className="text-amber-700">₹{completedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => setInvoiceOrder(completedOrder)}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>View / Print Tax Invoice</span>
          </button>

          <button
            onClick={() => setCompletedOrder(null)}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
