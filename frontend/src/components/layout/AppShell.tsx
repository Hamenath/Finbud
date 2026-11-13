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
    <div className="min-h-screen bg-[#05060A] text-[#F4F6FF] flex flex-col font-sans selection:bg-[#0033FF]/30 selection:text-[#F4F6FF]">
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

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Minimal Dark Footer */}
        <footer className="border-t border-[#191B25] bg-[#05060A] py-4 px-6 text-center text-xs font-mono text-[#71809B]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0033FF]" />
              <span>FINBUD • Precision Dark Wealth Analytics</span>
            </div>
            <div>Institutional Grade Cryptography • SEBI Educational Model</div>
          </div>
        </footer>
      </div>

      {/* 3. Global Static Bottom-Right FINBUD AI Widget with Smooth Open/Close */}
      <FinbudAiFloatingWidget />

      {/* 4. Dark Minimalist Quick Add Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0B0D14] border border-[#191B25] rounded-[14px] max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#191B25]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#0033FF] rounded-sm" />
                <h3 className="text-sm font-semibold text-[#F4F6FF]">Quick Log Transaction</h3>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1 rounded-md border border-[#191B25] bg-[#05060A] hover:bg-[#10131D] text-[#A9BCE0] cursor-pointer"
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
                      ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                      : 'bg-[#05060A] border-[#191B25] text-[#71809B]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    txType === 'INCOME'
                      ? 'bg-[#0033FF]/20 border-[#0033FF] text-[#0033FF]'
                      : 'bg-[#05060A] border-[#191B25] text-[#71809B]'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Cloud, Swiggy, Salary"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full dark-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="450"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full dark-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full dark-input"
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
                  className="w-full btn-electric py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Success Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0B0D14] border border-[#191B25] rounded-xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <div className="p-1 rounded-md bg-[#0033FF]/20 border border-[#0033FF]/40">
            <Check className="w-3.5 h-3.5 text-[#0033FF]" />
          </div>
          <span className="text-xs font-medium text-[#F4F6FF]">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
