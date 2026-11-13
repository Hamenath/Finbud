'use client';

import React, { useState, useEffect } from 'react';
import { TopNavbar } from './TopNavbar';
import { X, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { FinbudAiFloatingWidget } from '../ai/FinbudAiFloatingWidget';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const supabase = createClient();
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
    <div className="min-h-screen bg-[#FFFDF5] text-[#182B46] flex flex-col font-sans selection:bg-[#FFD05B] selection:text-[#182B46]">
      {/* 1. Unified Navigation Bar with Single Menu */}
      <TopNavbar onOpenQuickAdd={() => setShowQuickModal(true)} />

      {/* 2. Primary Full-Width Spacious Layout Container */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* 3. Minimal Neo-Brutalist Footer */}
      <footer className="border-t-[1.5px] border-[#182B46] bg-white py-4 px-6 text-center text-xs font-mono font-bold text-[#4B5E76]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD05B] border border-[#182B46]" />
            <span>FINBUD • Indian Financial Intelligence Engine</span>
          </div>
          <div>SEBI Educational Compliant • Encrypted Architecture</div>
        </div>
      </footer>

      {/* 4. Global Static Bottom-Right FINBUD AI Widget with Smooth Open/Close */}
      <FinbudAiFloatingWidget />

      {/* 5. Neo-Brutalist Quick Add Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#182B46]/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF5] border-[2px] border-[#182B46] rounded-[18px] shadow-[6px_6px_0_#182B46] max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-[1.5px] border-[#182B46]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FFD05B] border border-[#182B46] rounded-sm" />
                <h3 className="text-base font-extrabold text-[#182B46]">Quick Log Transaction</h3>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                className="p-1 rounded-md border border-[#182B46] bg-white hover:bg-[#FFD05B] text-[#182B46] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTxType('EXPENSE')}
                  className={`py-2 text-xs font-extrabold rounded-lg border-[1.5px] border-[#182B46] transition-all cursor-pointer ${
                    txType === 'EXPENSE'
                      ? 'bg-[#EF4444] text-white shadow-[2px_2px_0_#182B46]'
                      : 'bg-white text-[#182B46]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('INCOME')}
                  className={`py-2 text-xs font-extrabold rounded-lg border-[1.5px] border-[#182B46] transition-all cursor-pointer ${
                    txType === 'INCOME'
                      ? 'bg-[#FFD05B] text-[#182B46] shadow-[2px_2px_0_#182B46]'
                      : 'bg-white text-[#182B46]'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B46] mb-1">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, DMart Grocery"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-[#182B46] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD05B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B46] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="450"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-[#182B46] rounded-lg px-3 py-2 text-xs font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-[#FFD05B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182B46] mb-1">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-white border-[1.5px] border-[#182B46] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFD05B]"
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
                  className="w-full neo-btn-yellow py-2.5 text-xs font-extrabold cursor-pointer"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Success Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#E9FFF5] border-[1.5px] border-[#182B46] rounded-xl px-4 py-3 shadow-[4px_4px_0_#182B46] flex items-center gap-3">
          <div className="p-1 rounded-md bg-[#FFD05B] border border-[#182B46]">
            <Check className="w-4 h-4 text-[#182B46] stroke-[3]" />
          </div>
          <span className="text-xs font-bold text-[#182B46]">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
