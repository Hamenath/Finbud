'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { X, Check, AlertCircle } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);

  // Quick Transaction Form State
  const [txType, setTxType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Food & Dining');
  const [successToast, setSuccessToast] = useState(false);

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount) return;

    // Trigger feedback toast
    setShowQuickModal(false);
    setSuccessToast(true);
    setTxTitle('');
    setTxAmount('');
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Collapsible & Responsive Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Workspace Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Top Bar */}
        <TopNavbar
          onMenuClick={() => setMobileOpen(true)}
          onOpenQuickAdd={() => setShowQuickModal(true)}
        />

        {/* Global Academic & Regulatory Disclaimer Banner */}
        <div className="bg-[#121216] border-b border-[#1E1E26] px-4 py-2 text-center text-[11px] text-neutral-400">
          <span className="font-semibold text-[#F59E0B]">EDUCATIONAL DECISION-SUPPORT PROTOTYPE:</span>{' '}
          FINBUD is not a SEBI-registered investment adviser. Forecasts are algorithmic estimations.
          Verify consequential decisions with certified financial planners.
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Add Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141418] border border-[#2A2A38] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#22222B] mb-5">
              <div>
                <h3 className="font-bold text-base text-white">Log Financial Activity</h3>
                <p className="text-xs text-neutral-400">Record cash flow, investments, or EMIs</p>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1E1E28]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0A0A0C] rounded-xl border border-[#22222B]">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txType === 'EXPENSE'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Expense / Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txType === 'INCOME'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Income / Inflow
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Description / Payee
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy Instamart or Infosys Salary"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Amount (₹ INR)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 2400"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="EMI & Loans">EMI & Loans</option>
                  <option value="Investment / SIP">Investment / SIP</option>
                  <option value="Precious Metals">Precious Metals (Gold/Silver)</option>
                  <option value="Utilities & Bills">Utilities & Bills</option>
                  <option value="Salary & Bonus">Salary & Bonus</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Success Feedback Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141418] border border-emerald-500/40 text-emerald-400 shadow-2xl animate-in slide-in-from-bottom-5">
          <Check size={18} className="text-emerald-400" />
          <div className="text-xs">
            <p className="font-semibold text-white">Record Logged Successfully</p>
            <p className="text-[11px] text-neutral-400">Analytics and balance updated in real-time.</p>
          </div>
        </div>
      )}
    </div>
  );
};

