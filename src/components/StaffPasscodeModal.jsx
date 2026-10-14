import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle, Store } from 'lucide-react';

/**
 * Role-Based Access Control (RBAC) Passcode Modal
 * Protects Store Counter Admin from public customer access.
 * Default store counter PIN: 54321
 */
export default function StaffPasscodeModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    // Default counter staff PIN or admin passcode
    if (cleanPin === '54321' || cleanPin === 'admin' || cleanPin === '9848054321') {
      sessionStorage.setItem('vijayahub_staff_auth', 'true');
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Invalid Staff Passcode. Access restricted to Dwaraka Nagar store personnel.');
      setPin('');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200"
      >
        {/* Top Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#154d28] border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Store Counter Staff Portal
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Restricted access for Dwaraka Nagar hub executives. Enter counter staff PIN to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              maxLength={10}
              autoFocus
              placeholder="Enter Staff PIN (Default: 54321)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-sm font-mono tracking-widest font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#154d28] focus:border-[#154d28]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3 bg-[#154d28] hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter Admin</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Back to Customer Store
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <Store className="w-3 h-3 text-slate-400" />
          <span>Dwaraka Nagar Central Hub • Authorized Terminal Only</span>
        </div>
      </div>
    </div>
  );
}
