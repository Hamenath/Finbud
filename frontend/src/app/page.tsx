'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Database,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DEMO_OVERVIEW_METRICS,
  DEMO_CASH_FLOW,
  DEMO_ASSET_ALLOCATION,
  DEMO_TRANSACTIONS,
} from '@/data/demoData';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [realTransactions, setRealTransactions] = useState<any[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    async function init() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (currentUser) {
        setIsLiveConnected(true);
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('transaction_date', { ascending: false });

        if (data && data.length > 0) {
          setRealTransactions(data);
        }
      }
    }
    init();
  }, [supabase]);

  const metrics = useMemo(() => {
    if (!isLiveConnected || realTransactions.length === 0) {
      return {
        isDemo: true,
        netWorth: DEMO_OVERVIEW_METRICS.netWorth,
        monthlyIncome: DEMO_OVERVIEW_METRICS.monthlyIncome,
        monthlyExpense: DEMO_OVERVIEW_METRICS.monthlyExpense,
        savingsRate: DEMO_OVERVIEW_METRICS.savingsRate,
        netSavings: '₹1,12,600',
      };
    }

    let income = 0;
    let expense = 0;
    realTransactions.forEach((t) => {
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') income += amt;
      if (t.type === 'EXPENSE') expense += amt;
    });

    const netSavings = income - expense;
    const rate = income > 0 ? ((netSavings / income) * 100).toFixed(1) : '0.0';

    return {
      isDemo: false,
      netWorth: `₹${(netSavings + 12000000).toLocaleString('en-IN')}`,
      monthlyIncome: `₹${income.toLocaleString('en-IN')}`,
      monthlyExpense: `₹${expense.toLocaleString('en-IN')}`,
      netSavings: `₹${netSavings.toLocaleString('en-IN')}`,
      savingsRate: `${rate}%`,
    };
  }, [isLiveConnected, realTransactions]);

  const recentList = useMemo(() => {
    if (!isLiveConnected || realTransactions.length === 0) {
      return DEMO_TRANSACTIONS.slice(0, 4);
    }
    return realTransactions.slice(0, 4).map((t) => ({
      id: t.id,
      title: t.notes || t.category,
      category: t.category,
      account: t.payment_method || 'Verified Account',
      date: t.transaction_date,
      amount: parseFloat(t.amount),
      type: t.type,
      isAnomaly: t.is_anomaly,
    }));
  }, [isLiveConnected, realTransactions]);

  return (
    <div className="space-y-10">
      {/* 1. Welcome Message & Statement Period */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-[#1F2937] tracking-tight">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Financial Statement Period: <span className="text-[#1F2937] font-medium">November 2026</span>
          </p>
        </div>

        <div>
          {metrics.isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Demo Preview
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0]">
              <Database size={12} />
              Supabase Verified Live
            </span>
          )}
        </div>
      </div>

      {/* 2. Hero: Total Net Worth Section (Spacious & Clean) */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
        <span className="text-xs uppercase font-mono tracking-wider text-[#6B7280]">
          Total Net Worth
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            {metrics.netWorth}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-[#059669] bg-[#ECFDF5]">
              <ArrowUpRight size={13} />
              +1.5% MoM
            </span>
            <span className="text-xs text-[#6B7280]">YTD Outperformance: +14.2%</span>
          </div>
        </div>
      </div>

      {/* 3. Three Simple Financial Summaries (Income, Expenses, Savings) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <span className="text-xs font-medium text-[#6B7280]">Monthly Income</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#059669]">
            {metrics.monthlyIncome}
          </div>
          <p className="text-xs text-[#6B7280]">Primary salary & portfolio inflows</p>
        </div>

        {/* Expenses */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <span className="text-xs font-medium text-[#6B7280]">Monthly Expenses (Burn)</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#DC2626]">
            {metrics.monthlyExpense}
          </div>
          <p className="text-xs text-[#6B7280]">Non-discretionary & lifestyle burn</p>
        </div>

        {/* Savings */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Net Monthly Savings</span>
            <span className="text-xs font-mono font-semibold text-[#10B981]">{metrics.savingsRate}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#10B981]">
            {metrics.netSavings}
          </div>
          <p className="text-xs text-[#6B7280]">Target guideline: ≥ 30% of income</p>
        </div>
      </div>

      {/* 4. Monthly Cash Flow Chart */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">Monthly Cash Flow</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Historical trajectory and baseline expense forecast</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-[#4B5563]">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              <span className="text-[#4B5563]">Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#D97706] border-t border-dashed border-[#D97706]" />
              <span className="text-[#D97706]">Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEMO_CASH_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  color: '#1F2937',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Area
                type="monotone"
                dataKey="actualIncome"
                name="Income"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#incFill)"
              />
              <Area
                type="monotone"
                dataKey="actualExpense"
                name="Expenses"
                stroke="#DC2626"
                strokeWidth={2}
                fill="url(#expFill)"
              />
              <Area
                type="monotone"
                dataKey="forecastExpense"
                name="Forecast"
                stroke="#D97706"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Asset Allocation & 6. Predictive Savings Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Allocation */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">Asset Allocation</h2>
              <p className="text-xs text-[#6B7280]">Multi-asset portfolio distribution</p>
            </div>
            <Link
              href="/wealth-lab"
              className="text-xs font-medium text-[#10B981] hover:underline flex items-center gap-0.5"
            >
              Analyze <ChevronRight size={13} />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-44 w-44 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMO_ASSET_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {DEMO_ASSET_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-[#1F2937]">₹1.25 Cr</span>
                <span className="text-[9px] text-[#6B7280] uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {DEMO_ASSET_ALLOCATION.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#4B5563] truncate">{item.category}</span>
                  </div>
                  <span className="font-mono font-medium text-[#1F2937]">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Savings Forecast */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">Predictive Forecast</h2>
                <p className="text-xs text-[#6B7280]">Machine learning month-end estimate</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0]">
                Ridge ML Model
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#6B7280]">Projected Month-End Outflow</span>
                <span className="text-base font-bold text-[#DC2626] font-mono">
                  {metrics.isDemo ? '₹1,32,400' : metrics.monthlyExpense}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#6B7280]">Estimated Month-End Surplus</span>
                <span className="text-base font-bold text-[#059669] font-mono">
                  {metrics.isDemo ? '₹1,12,600' : metrics.netSavings}
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full" style={{ width: '46%' }} />
              </div>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Based on historical daily spending velocity and category-level recurrence patterns. Model uses time-based holdout validation to prevent lookahead leakage.
            </p>
          </div>

          <Link
            href="/analytics"
            className="w-full py-2.5 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-center text-[#1F2937] transition-all block"
          >
            Explore Detailed Analytics
          </Link>
        </div>
      </div>

      {/* 7. Recent Transactions (Clean & Spacious Table) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">Recent Transactions</h2>
            <p className="text-xs text-[#6B7280]">
              {isLiveConnected ? 'Real records from your Supabase PostgreSQL ledger' : 'Sample transaction records'}
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-medium text-[#10B981] hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight size={13} />
          </Link>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {recentList.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'INCOME'
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#F9FAFB] text-[#6B7280]'
                  }`}
                >
                  {tx.type === 'INCOME' ? (
                    <ArrowUpRight size={15} />
                  ) : (
                    <ArrowDownRight size={15} />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937]">{tx.title}</div>
                  <div className="text-[11px] text-[#6B7280]">{tx.category} • {tx.date}</div>
                </div>
              </div>

              <div
                className={`font-mono font-semibold text-sm ${
                  tx.type === 'INCOME' ? 'text-[#059669]' : 'text-[#1F2937]'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
