import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Store,
  FileText,
  ArrowRight,
  MapPin,
  Phone,
  AlertTriangle,
  CalendarCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderSuccessModal() {
  const { completedOrder, setCompletedOrder, setInvoiceOrder, storeInfo } = useStore();
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate live remaining time until 24-hour expiration
  useEffect(() => {
    if (!completedOrder?.expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(completedOrder.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRED (Cancelled & Restocked)');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [completedOrder]);

  if (!completedOrder) return null;

  const isCancelled = completedOrder.status === 'Cancelled';

  // Steps
  const steps = [
    { label: 'Order Placed', desc: 'Reserved at Hub' },
    { label: 'Packed', desc: 'Sealed & Labeled' },
    { label: 'Ready for Pickup', desc: 'At Dwaraka Nagar' },
    { label: 'Collected', desc: 'Handed to Customer' }
  ];

  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Packed':
        return 1;
      case 'Ready for Pickup':
        return 2;
      case 'Completed':
      case 'Collected':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getActiveStepIndex(completedOrder.status);

  const formattedExpiry = completedOrder.expiresAt
    ? new Date(completedOrder.expiresAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      })
    : 'Within 24 Hours';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-6 text-center relative text-white ${
          isCancelled ? 'bg-rose-700' : 'bg-gradient-to-r from-emerald-600 to-teal-700'
        }`}>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isCancelled ? <AlertTriangle className="w-8 h-8 text-white" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {isCancelled ? 'Order Cancelled' : 'Store Pickup Reserved!'}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Order ID: <strong className="text-white font-mono">{completedOrder.id}</strong>
          </p>
          <span className="inline-block mt-2 bg-emerald-800/60 text-emerald-100 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            Dwaraka Nagar Hub • Exclusively Store Pickup
          </span>

          <button
            onClick={() => setCompletedOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 24-HOUR PICKUP WINDOW & COUNTDOWN BOX */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-950 text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>24-Hour Pickup Window</span>
              </div>
              <span className="font-mono font-bold text-xs bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                {timeLeft || '24 hrs remaining'}
              </span>
            </div>

            <div className="space-y-1 text-slate-700 text-[11px]">
              <p>
                <strong>Selected Pickup Slot:</strong>{' '}
                <span className="text-amber-900 font-semibold">{completedOrder.pickupSlot || 'Immediate'}</span>
              </p>
              <p>
                <strong>Must Collect Before:</strong>{' '}
                <span className="text-rose-700 font-bold font-mono">{formattedExpiry}</span>
              </p>
              <p className="text-slate-500 pt-1 text-[10px]">
                ⚠️ <em>If not collected within 24 hours, the order is automatically cancelled and items are restored to inventory.</em>
              </p>
            </div>
          </div>

          {/* UNIQUE PICKUP VERIFICATION OTP CARD */}
          {!isCancelled && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 block">
                  Your Pickup Verification OTP
                </span>
                <p className="text-xs text-white font-medium mt-0.5">
                  Show this 4-digit code at Dwaraka Nagar counter for parcel handover
                </p>
              </div>
              <div className="bg-white text-slate-900 font-mono font-black text-2xl px-4 py-2 rounded-xl tracking-widest shadow-lg shrink-0">
                {completedOrder.pickupOtp || completedOrder.pickup_otp || completedOrder.customer?.pickupOtp || '4821'}
              </div>
            </div>
          )}

          {/* Live Order Tracker (Only if not cancelled) */}
          {!isCancelled && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pickup Status:
                </h3>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {completedOrder.status}
                </span>
              </div>

              {/* Tracker Step Indicators */}
              <div className="relative grid grid-cols-4 gap-2 pt-1">
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
          )}

          {/* Collection Instructions Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Store className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 mb-0.5">
                  Collection Location:
                </p>
                <p className="text-slate-700 text-[11px] leading-relaxed mb-2">
                  {storeInfo.name} • {storeInfo.address}
                </p>
                <p className="text-[11px] text-slate-600">
                  Show your Order ID <strong className="font-mono text-slate-950 font-bold">{completedOrder.id}</strong> and mobile number at the store counter.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold mt-2 pt-2 border-t border-slate-200">
                  <span>⏰ Hours: {storeInfo.workingHours}</span>
                  <span>📞 {storeInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
              Reserved Items:
            </h4>
            {completedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {item.quantity}x {item.title}
                  </span>
                  {item.selectedWeight && (
                    <span className="text-[10px] text-amber-800 font-bold">
                      Pack: {item.selectedWeight}
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}

            <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Amount:</span>
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
