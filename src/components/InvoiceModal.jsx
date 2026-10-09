import React from 'react';
import { X, Printer, CheckCircle, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function InvoiceModal() {
  const { invoiceOrder, setInvoiceOrder, storeInfo } = useStore();

  if (!invoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(invoiceOrder.date || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden print:shadow-none print:rounded-none animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Official Tax Invoice Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setInvoiceOrder(null)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-10 font-sans text-slate-800 text-xs print:text-black">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Vijaya<span className="text-amber-600">Hub</span>
                </span>
                <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
                  Tax Invoice
                </span>
              </div>
              <p className="font-semibold text-slate-800">{storeInfo.name}</p>
              <p className="text-[11px] text-slate-500 max-w-xs leading-tight">
                {storeInfo.address}
              </p>
              <div className="mt-2 text-[10px] text-slate-600 space-y-0.5">
                <p><strong>GSTIN:</strong> {storeInfo.gstNumber}</p>
                <p><strong>FSSAI Lic No:</strong> {storeInfo.fssaiNumber}</p>
                <p><strong>Phone:</strong> {storeInfo.phone} | <strong>Email:</strong> {storeInfo.email}</p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-base font-extrabold text-slate-900 uppercase">
                Invoice #{invoiceOrder.id}
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Date: {invoiceDate}</p>
              <div className="mt-2 space-y-1">
                <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px]">
                  Status: {invoiceOrder.paymentStatus || 'PAID'}
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Mode: {invoiceOrder.paymentMethod || 'Direct UPI'}
                </p>
                {invoiceOrder.upiRefNumber && invoiceOrder.upiRefNumber !== 'Direct Transfer' && (
                  <p className="text-[10px] font-mono text-slate-600 font-bold">
                    UTR: {invoiceOrder.upiRefNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-200 mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Customer Details:
              </p>
              <p className="font-extrabold text-slate-900 text-sm">{invoiceOrder.customer.name}</p>
              <p className="text-slate-600 mt-0.5">Phone: {invoiceOrder.customer.phone}</p>
              {invoiceOrder.customer.email && (
                <p className="text-slate-500">{invoiceOrder.customer.email}</p>
              )}
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Fulfillment Mode:
              </p>
              <p className="font-extrabold text-slate-900">
                Store Pickup (Dwaraka Nagar Hub)
              </p>
              <p className="text-slate-600 text-[11px] mt-0.5 max-w-xs">
                Slot: <strong>{invoiceOrder.pickupSlot || 'Immediate'}</strong>
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                Counter: Door No. 47-10-22, Dwaraka Nagar, Vizag
              </p>
            </div>
          </div>

          {/* Table of items */}
          <table className="w-full text-left mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-[10px] uppercase tracking-wider text-slate-600">
                <th className="py-2">#</th>
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoiceOrder.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                  <td className="py-2 font-medium text-slate-900 pr-2">
                    {item.title}
                  </td>
                  <td className="py-2 text-center font-mono text-[10px] text-slate-500">
                    {item.title.toLowerCase().includes('grinder') || item.title.toLowerCase().includes('fryer') || item.title.toLowerCase().includes('cooktop') ? '8509' : '0802'}
                  </td>
                  <td className="py-2 text-center font-semibold">{item.quantity}</td>
                  <td className="py-2 text-right text-slate-600">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-2 text-right font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Net):</span>
                <span>₹{invoiceOrder.itemSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>CGST (Included):</span>
                <span>₹{Math.round(invoiceOrder.itemSubtotal * 0.045).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>SGST (Included):</span>
                <span>₹{Math.round(invoiceOrder.itemSubtotal * 0.045).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span>{invoiceOrder.deliveryFee === 0 ? 'FREE' : `₹${invoiceOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t-2 border-slate-300">
                <span>Total Amount:</span>
                <span className="text-amber-700">₹{invoiceOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Declaration and Signature */}
          <div className="border-t border-slate-200 pt-4 flex justify-between items-end text-[10px] text-slate-500">
            <div>
              <p className="font-bold text-slate-700 mb-0.5">Terms & Conditions:</p>
              <p>1. Goods once inspected and sold are covered by manufacturer warranty/freshness seal.</p>
              <p>2. Subject to Visakhapatnam jurisdiction only.</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">For VijayaHub</p>
              <div className="h-8 flex items-center justify-end">
                <span className="font-serif italic text-slate-600">[Authorized Signatory]</span>
              </div>
              <p className="text-[9px] text-slate-400">Computer Generated Tax Invoice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
