'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { DEMO_TRANSACTIONS } from '@/data/demoData';

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = DEMO_TRANSACTIONS.filter((tx) => {
    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase()) && !tx.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Income & Expense Ledger
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Categorized audit-ready transaction records with anomaly surveillance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting verified transactions as CSV...')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1F1F2A] border border-[#262636] text-xs font-semibold text-white transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141418] border border-[#22222D] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, account or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A0A0C] border border-[#22222B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#F59E0B]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-amber-500/20 text-[#F59E0B] border border-amber-500/30'
                  : 'bg-[#0A0A0C] text-neutral-400 hover:text-white border border-[#22222B]'
              }`}
            >
              {type === 'ALL' ? 'All Transactions' : type === 'EXPENSE' ? 'Expenses' : 'Incomes'}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl bg-[#141418] border border-[#22222D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0C] text-neutral-400 font-mono uppercase text-[10px] border-b border-[#22222D]">
              <tr>
                <th className="px-5 py-3.5">Transaction</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Account / Source</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Status / Anomaly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F2A]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#191922] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'INCOME'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {tx.type === 'INCOME' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                      </div>
                      <span className="font-semibold text-white">{tx.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-300">{tx.category}</td>
                  <td className="px-5 py-4 text-neutral-400 font-mono text-[11px]">{tx.account}</td>
                  <td className="px-5 py-4 text-neutral-400">{tx.date}</td>
                  <td
                    className={`px-5 py-4 text-right font-mono font-bold ${
                      tx.type === 'INCOME' ? 'text-emerald-400' : 'text-neutral-200'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {tx.isAnomaly ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-[#F59E0B] px-2 py-0.5 rounded-full font-mono font-bold border border-amber-500/30">
                        <AlertTriangle size={11} /> Flagged Anomaly
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                        <CheckCircle size={11} /> Verified Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

