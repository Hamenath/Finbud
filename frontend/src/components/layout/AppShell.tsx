'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { X, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Quick Transaction Form State
  const [txType, setTxType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Food & Dining');
  const [successToast, setSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Record Logged Successfully');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount) return;

    const numericAmount = parseFloat(txAmount);

    if (user) {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: numericAmount,
        type: txType,
        category: txCategory,
        notes: txTitle,
        payment_method: 'UPI',
        is_recurring: false,
      });

      if (error) {
        alert(`Database Error: ${error.message}`);
        return;
      }
      setToastMessage('Saved directly to Supabase PostgreSQL Database!');
    } else {
      setToastMessage('Record logged to live demo view (Sign in for permanent sync).');
    }

    setShowQuickModal(false);
    setSuccessToast(true);
    setTxTitle('');
    setTxAmount('');
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#111827] flex flex-col font-sans selection:bg-[#10B981]/20 selection:text-[#087F5B]">
      {/* 1. Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Layout Shell */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopNavbar
          onMenuClick={() => setMobileOpen(true)}
          onOpenQuickAdd={() => setShowQuickModal(true)}
        />

        {/* Global Academic & Regulatory Disclaimer Banner (Light theme) */}
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-4 py-2 text-center text-[11px] text-[#065F46]">
          <span className="font-semibold text-[#087F5B]">EDUCATIONAL DECISION-SUPPORT PROTOTYPE:</span>{' '}
          FINBUD is not a SEBI-registered investment adviser. Calculations are mathematical models.
          Verify consequential decisions with certified professionals.
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Add Modal (Light Theme) */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
              <div>
                <h3 className="font-bold text-base text-[#111827]">Log Financial Activity</h3>
                <p className="text-xs text-[#6B7280]">
                  {user ? 'Syncing to your isolated Supabase table' : 'Sign in to persist records across devices'}
                </p>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txType === 'EXPENSE'
                      ? 'bg-white text-[#DC2626] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  Expense / Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    txType === 'INCOME'
                      ? 'bg-white text-[#059669] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  Income / Inflow
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  Description / Payee
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy Instamart or Tech Salary"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  Amount (₹ INR)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 2400"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#10B981]"
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

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#A7F3D0] text-[#065F46] shadow-lg animate-in slide-in-from-bottom-5">
          <Check size={18} className="text-[#10B981]" />
          <div className="text-xs">
            <p className="font-semibold text-[#111827]">Transaction Recorded</p>
            <p className="text-[11px] text-[#6B7280]">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
