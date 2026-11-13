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
      setToastMessage('Transaction saved to Supabase ledger.');
    } else {
      setToastMessage('Transaction saved to session preview.');
    }

    setShowQuickModal(false);
    setSuccessToast(true);
    setTxTitle('');
    setTxAmount('');
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] flex flex-col font-sans selection:bg-[#1E40AF]/20 selection:text-[#1E3A8A]">
      {/* 1. Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Content Frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopNavbar
          onMenuClick={() => setMobileOpen(true)}
          onOpenQuickAdd={() => setShowQuickModal(true)}
        />

        {/* Spacious Centered Content (Max ~1200px, 32px vertical breathing space) */}
        <main className="flex-1 px-6 sm:px-8 py-8 sm:py-10 max-w-[1200px] w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Quick Add Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
              <div>
                <h3 className="font-bold text-base text-[#1F2937]">Quick Transaction</h3>
                <p className="text-xs text-[#6B7280]">
                  {user ? 'Logs directly to your verified account' : 'Preview entry in session'}
                </p>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    txType === 'EXPENSE'
                      ? 'bg-white text-[#DC2626] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  Expense Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    txType === 'INCOME'
                      ? 'bg-white text-[#1E40AF] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  Income Inflow
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grocery basket or Salary"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Amount (₹ INR)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 2500"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] font-mono focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="EMI & Loans">EMI & Loans</option>
                  <option value="Investment / SIP">Investment / SIP</option>
                  <option value="Precious Metals">Precious Metals</option>
                  <option value="Utilities & Bills">Utilities & Bills</option>
                  <option value="Salary & Bonus">Salary & Bonus</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1E40AF] text-white font-medium text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#BFDBFE] text-[#1E3A8A] shadow-md animate-in slide-in-from-bottom-5">
          <Check size={16} className="text-[#1E40AF]" />
          <div className="text-xs font-medium">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

