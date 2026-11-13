'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Database,
  Trash2,
  Edit2,
  X,
  TrendingDown,
  TrendingUp,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { DEMO_TRANSACTIONS } from '@/data/demoData';

interface Transaction {
  id: string;
  notes: string;
  category: string;
  payment_method: string;
  transaction_date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  is_anomaly: boolean;
}

const CATEGORIES = [
  'All Categories',
  'Food & Dining',
  'Housing & Rent',
  'EMI & Loans',
  'Investment / SIP',
  'Precious Metals',
  'Utilities & Bills',
  'Salary & Bonus',
  'Healthcare',
  'Travel & Transport',
  'Shopping & Discretionary',
];

const PAYMENT_METHODS = ['UPI', 'NetBanking', 'Credit Card', 'Debit Card', 'Cash'];

export default function TransactionsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('DATE_DESC');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Food & Dining');
  const [formPaymentMethod, setFormPaymentMethod] = useState('UPI');
  const [formDate, setFormDate] = useState('2026-11-13');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (currentUser) {
        await fetchTransactions(currentUser.id);
      } else {
        setIsDemoMode(true);
        const demoMapped: Transaction[] = DEMO_TRANSACTIONS.map((t) => ({
          id: t.id,
          notes: t.title,
          category: t.category,
          payment_method: t.account,
          transaction_date: '2026-11-10',
          amount: t.amount,
          type: t.type,
          is_anomaly: t.isAnomaly || false,
        }));
        setTransactions(demoMapped);
        setLoading(false);
      }
    }
    init();
  }, [supabase]);

  const fetchTransactions = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (data) {
      const mapped: Transaction[] = data.map((d: any) => ({
        id: d.id,
        notes: d.notes || d.category,
        category: d.category,
        payment_method: d.payment_method || 'UPI',
        transaction_date: d.transaction_date,
        amount: parseFloat(d.amount),
        type: d.type,
        is_anomaly: d.is_anomaly || false,
      }));
      setTransactions(mapped);
      setIsDemoMode(false);
    }
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingTx(null);
    setFormType('EXPENSE');
    setFormTitle('');
    setFormAmount('');
    setFormCategory('Food & Dining');
    setFormPaymentMethod('UPI');
    setFormDate('2026-11-13');
    setModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormType(tx.type);
    setFormTitle(tx.notes);
    setFormAmount(tx.amount.toString());
    setFormCategory(tx.category);
    setFormPaymentMethod(tx.payment_method);
    setFormDate(tx.transaction_date);
    setModalOpen(true);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    setSubmitting(true);
    const numAmount = parseFloat(formAmount);

    if (user) {
      if (editingTx) {
        const { error } = await supabase
          .from('transactions')
          .update({
            notes: formTitle,
            amount: numAmount,
            type: formType,
            category: formCategory,
            payment_method: formPaymentMethod,
            transaction_date: formDate,
          })
          .eq('id', editingTx.id)
          .eq('user_id', user.id);

        if (error) {
          alert(`Update failed: ${error.message}`);
        } else {
          showToast('Transaction updated successfully in Supabase!');
          await fetchTransactions(user.id);
          setModalOpen(false);
        }
      } else {
        const { error } = await supabase.from('transactions').insert({
          user_id: user.id,
          notes: formTitle,
          amount: numAmount,
          type: formType,
          category: formCategory,
          payment_method: formPaymentMethod,
          transaction_date: formDate,
          is_recurring: false,
        });

        if (error) {
          alert(`Insert failed: ${error.message}`);
        } else {
          showToast('Transaction saved directly to Supabase!');
          await fetchTransactions(user.id);
          setModalOpen(false);
        }
      }
    } else {
      if (editingTx) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === editingTx.id
              ? {
                  ...t,
                  notes: formTitle,
                  amount: numAmount,
                  type: formType,
                  category: formCategory,
                  payment_method: formPaymentMethod,
                  transaction_date: formDate,
                }
              : t
          )
        );
        showToast('Demo transaction updated.');
      } else {
        const newDemoTx: Transaction = {
          id: `demo-${Date.now()}`,
          notes: formTitle,
          amount: numAmount,
          type: formType,
          category: formCategory,
          payment_method: formPaymentMethod,
          transaction_date: formDate,
          is_anomaly: false,
        };
        setTransactions((prev) => [newDemoTx, ...prev]);
        showToast('Demo transaction added.');
      }
      setModalOpen(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction record?')) return;

    if (user) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        alert(`Delete failed: ${error.message}`);
        return;
      }
      showToast('Transaction deleted from Supabase.');
      await fetchTransactions(user.id);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Demo record deleted.');
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (filterType !== 'ALL' && tx.type !== filterType) return false;
        if (filterCategory !== 'All Categories' && tx.category !== filterCategory) return false;
        if (
          search &&
          !tx.notes.toLowerCase().includes(search.toLowerCase()) &&
          !tx.category.toLowerCase().includes(search.toLowerCase()) &&
          !tx.payment_method.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'DATE_DESC') return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        if (sortBy === 'DATE_ASC') return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
        if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, filterType, filterCategory, search, sortBy]);

  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'INCOME') income += tx.amount;
      if (tx.type === 'EXPENSE') expense += tx.amount;
    });
    const netSavings = income - expense;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
    return {
      totalIncome: income,
      totalExpense: expense,
      netSavings,
      savingsRate: savingsRate.toFixed(1),
    };
  }, [transactions]);

  const handleExportCSV = () => {
    const headers = ['ID,Title,Type,Category,Payment_Method,Date,Amount_INR\n'];
    const rows = filteredTransactions.map(
      (t) =>
        `"${t.id}","${t.notes}","${t.type}","${t.category}","${t.payment_method}","${t.transaction_date}",${t.amount}`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FINBUD_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Income & Expense Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Complete audit-ready ledger with real-time Supabase PostgreSQL synchronization
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#E5E7EB] text-[#111827] text-xs font-mono font-semibold">
              <Database size={13} /> SUPABASE POSTGRESQL LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-mono font-semibold">
              <Database size={13} /> DEMO DATA MODE
            </span>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7FAF8] border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-all shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-[#111827] hover:bg-[#10B981] text-[#111827] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* 2. Accurate Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
            <span>Total Recorded Inflow</span>
            <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#111827] flex items-center justify-center">
              <TrendingUp size={15} />
            </span>
          </div>
          <div className="text-2xl font-black text-[#111827] tracking-tight">
            ₹{metrics.totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-[#6B7280] font-mono">
            {transactions.filter((t) => t.type === 'INCOME').length} Inflow transactions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
            <span>Total Recorded Outflow</span>
            <span className="w-7 h-7 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <TrendingDown size={15} />
            </span>
          </div>
          <div className="text-2xl font-black text-[#DC2626] tracking-tight">
            ₹{metrics.totalExpense.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-[#6B7280] font-mono">
            {transactions.filter((t) => t.type === 'EXPENSE').length} Expense transactions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
            <span>Net Monthly Surplus</span>
            <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#111827] flex items-center justify-center">
              <Wallet size={15} />
            </span>
          </div>
          <div
            className={`text-2xl font-black tracking-tight ${
              metrics.netSavings >= 0 ? 'text-[#111827]' : 'text-[#DC2626]'
            }`}
          >
            {metrics.netSavings >= 0 ? '+' : ''}₹{metrics.netSavings.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-[#6B7280] font-mono">
            Inflow minus Outflow
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
            <span>Savings Efficiency Rate</span>
            <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#111827] flex items-center justify-center">
              <PiggyBank size={15} />
            </span>
          </div>
          <div className="text-2xl font-black text-[#111827] tracking-tight">
            {metrics.savingsRate}%
          </div>
          <div className="mt-1 text-[11px] text-[#6B7280] font-mono">
            Target benchmark ≥ 30%
          </div>
        </div>
      </div>

      {/* 3. Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by description, payee, category or payment mode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
            >
              <option value="DATE_DESC">Date: Newest First</option>
              <option value="DATE_ASC">Date: Oldest First</option>
              <option value="AMOUNT_DESC">Amount: Highest First</option>
              <option value="AMOUNT_ASC">Amount: Lowest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB]">
          <span className="text-[11px] text-[#6B7280] font-medium mr-2">Filter Type:</span>
          {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-[#10B981] text-[#111827] text-white shadow-xs'
                  : 'bg-[#F7FAF8] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]'
              }`}
            >
              {type === 'ALL' ? 'All' : type === 'EXPENSE' ? 'Expenses Only' : 'Incomes Only'}
            </button>
          ))}
          <span className="text-[11px] text-[#6B7280] font-mono ml-auto">
            Showing {filteredTransactions.length} of {transactions.length} records
          </span>
        </div>
      </div>

      {/* 4. Table */}
      <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E40AF] border-t-transparent animate-spin mx-auto mb-3" />
            Loading verified ledger records from Supabase...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center mx-auto mb-3">
              <Calendar size={22} />
            </div>
            <p className="font-semibold text-[#111827] text-sm">No Transactions Found</p>
            <p className="text-[#6B7280] mt-1">
              {search || filterCategory !== 'All Categories'
                ? 'Try clearing your filters or search keywords.'
                : 'Click "+ Add Entry" to record your first income or expense.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAF8] text-[#6B7280] font-mono uppercase text-[10px] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-5 py-3.5">Transaction Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F7FAF8] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.type === 'INCOME'
                              ? 'bg-[#ECFDF5] text-[#111827]'
                              : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          {tx.type === 'INCOME' ? (
                            <ArrowUpRight size={15} />
                          ) : (
                            <ArrowDownRight size={15} />
                          )}
                        </div>
                        <span className="font-semibold text-[#111827]">{tx.notes}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#374151]">{tx.category}</td>
                    <td className="px-5 py-4 text-[#6B7280] font-mono text-[11px]">
                      {tx.payment_method}
                    </td>
                    <td className="px-5 py-4 text-[#6B7280] font-mono text-[11px]">
                      {tx.transaction_date}
                    </td>
                    <td
                      className={`px-5 py-4 text-right font-mono font-bold ${
                        tx.type === 'INCOME' ? 'text-[#111827]' : 'text-[#111827]'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {tx.is_anomaly ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-mono font-bold">
                          <AlertTriangle size={11} /> Spike
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#ECFDF5] text-[#111827] px-2 py-0.5 rounded-full font-mono">
                          <CheckCircle size={11} /> Verified
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-5">
              <div>
                <h3 className="font-bold text-base text-[#111827]">
                  {editingTx ? 'Edit Transaction' : 'Record New Transaction'}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {user
                    ? 'Changes sync directly to your private PostgreSQL table'
                    : 'Changes apply to live demo session'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setFormType('EXPENSE')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    formType === 'EXPENSE'
                      ? 'bg-white text-[#DC2626] shadow-xs'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  Expense / Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('INCOME')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    formType === 'INCOME'
                      ? 'bg-white text-[#111827] shadow-xs'
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
                  placeholder="e.g. Swiggy, HDFC Home Loan EMI, Tech Salary"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={1}
                    placeholder="e.g. 2500"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] text-[#111827] hover:bg-[#10B981] text-[#111827] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTx ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle size={18} className="text-[#111827]" />
          <div className="text-xs">
            <p className="font-semibold text-[#111827]">Action Completed</p>
            <p className="text-[11px] text-[#6B7280]">{toastMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}

