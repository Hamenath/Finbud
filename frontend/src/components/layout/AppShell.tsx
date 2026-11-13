'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { X, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { FinbudAiFloatingWidget } from '../ai/FinbudAiFloatingWidget';

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
    <div className="min-h-screen bg-[#F7FAF8] text-[#111827] flex flex-col font-sans selection:bg-[#10B981]/20 selection:text-[#087F5B]">
      {/* 1. Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Primary Layout Canvas */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopNavbar
          onMenuClick={() => setMobileOpen(true)}
          onOpenQuickAdd={() => setShowQuickModal(true)}
        />

        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Minimal Clean Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-4 px-6 text-center text-xs font-mono text-[#6B7280]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>FINBUD • Indian Financial Intelligence Engine</span>
            </div>
            <div>SEBI Educational Compliant • Encrypted Architecture</div>
          </div>
        </footer>
      </div>

      {/* 3. Global Bottom-Right FINBUD AI Widget */}
      <FinbudAiFloatingWidget />

      {/* 4. Quick Add Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full" />
                <h3 className="text-base font-bold text-[#111827]">Quick Log Transaction</h3>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    txType === 'EXPENSE'
                      ? 'bg-[#DC2626] text-white border-[#DC2626]'
                      : 'bg-white text-[#4B5563] border-[#E5E7EB]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    txType === 'INCOME'
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : 'bg-white text-[#4B5563] border-[#E5E7EB]'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, DMart Grocery"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#10B981]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="450"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white focus:border-[#10B981]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] mb-1">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-[#10B981]"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Salary">Salary</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
          <div className="p-1 rounded-full bg-[#ECFDF5] text-[#10B981]">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-medium text-[#111827]">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
