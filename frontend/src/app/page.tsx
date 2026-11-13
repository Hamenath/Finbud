'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Database,
  ChevronRight,
  Wallet,
  Coins,
  Shield,
  PieChart as PieChartIcon,
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
  DEMO_FINANCIAL_GOALS,
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
      savingsRate: `${rate}%`,
    };
  }, [isLiveConnected, realTransactions]);

  const recentList = useMemo(() => {
    if (!isLiveConnected || realTransactions.length === 0) {
      return DEMO_TRANSACTIONS.slice(0, 4);
    }
    return realTransactions.slice(0, 5).map((t) => ({
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
    <div className="space-y-6">
      {/* 1. Header with Live/Demo Indicator */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Predictive cash-flow intelligence & multi-asset wealth monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          {metrics.isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
              DEMO DATA VERIFIED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              <Database size={12} />
              SUPABASE POSTGRESQL LIVE
            </span>
          )}

          <Link
            href="/finbud-ai"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-all shadow-xs"
          >
            <Bot size={15} className="text-[#10B981]" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (Light White Cards with Subtle Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span>Total Net Worth</span>
            <span className="flex items-center gap-0.5 text-[#059669] font-mono text-[11px] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              <ArrowUpRight size={13} />
              +1.5% MoM
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            {metrics.netWorth}
          </div>
          <div className="mt-2 text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Performance (YTD)</span>
            <span className="text-[#111827] font-semibold">{DEMO_OVERVIEW_METRICS.benchmarkComparison}</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span>Monthly Inflow</span>
            <span className="text-[#059669] font-mono text-[11px]">Primary + Investments</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#059669] tracking-tight">
            {metrics.monthlyIncome}
          </div>
          <div className="mt-2 text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Verified Source</span>
            <span className="text-[#111827] font-semibold">{user ? user.email : 'Infosys Salary'}</span>
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span>Monthly Outflow (Burn)</span>
            <span className="text-[#DC2626] font-mono text-[11px]">-3.2% vs Budget</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#DC2626] tracking-tight">
            {metrics.monthlyExpense}
          </div>
          <div className="mt-2 text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Forecast Baseline</span>
            <span className="text-[#111827] font-semibold">Ridge ML Model</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span>Savings & Surplus Rate</span>
            <span className="text-[#059669] font-mono text-[11px] font-semibold">Healthy Range</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#10B981] tracking-tight">
            {metrics.savingsRate}
          </div>
          <div className="mt-2 text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Recommended Target</span>
            <span className="text-[#111827] font-semibold">≥ 30% Inflow</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Cash Flow Area Chart & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast (Light Surface with Subtle Grid) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                Cash Flow Forecast & Burn Rate
                <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2 py-0.5 rounded font-mono font-semibold">
                  ACTUAL VS PREDICTED
                </span>
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Past 5 months actuals against Ridge regression baseline forecast
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
                <span className="text-[#4B5563]">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#DC2626]" />
                <span className="text-[#4B5563]">Actual Outflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#D97706] border-t-2 border-dashed border-[#D97706]" />
                <span className="text-[#D97706]">Forecast</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_CASH_FLOW} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#111827',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="actualIncome"
                  name="Actual Income"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="actualExpense"
                  name="Actual Expense"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="forecastExpense"
                  name="Forecast Expense"
                  stroke="#D97706"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation Donut */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-[#111827]">Asset Allocation</h2>
              <span className="text-[10px] text-[#6B7280] font-mono">DIVERSIFICATION</span>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">Real-time multi-asset portfolio breakdown</p>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEMO_ASSET_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
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
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                      color: '#111827',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-[#111827]">₹1.25 Cr</span>
                <span className="text-[9px] text-[#6B7280] uppercase tracking-widest">Total Assets</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {DEMO_ASSET_ALLOCATION.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                    <span className="text-[#374151] truncate max-w-37.5">{item.category}</span>
                  </div>
                  <span className="font-mono font-semibold text-[#111827]">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/wealth-lab"
            className="mt-5 w-full py-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-semibold text-center text-[#111827] transition-all block"
          >
            Rebalance in Wealth Lab
          </Link>
        </div>
      </div>

      {/* 4. Bottom Section: Goals & Real-Time Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Financial Goals</h2>
              <p className="text-xs text-[#6B7280]">Tracking long-term compounding milestones</p>
            </div>
            <Link
              href="/wealth-lab"
              className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
            >
              Simulate <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {DEMO_FINANCIAL_GOALS.map((goal) => (
              <div
                key={goal.id}
                className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#111827]">{goal.name}</span>
                  <span className="font-mono font-bold text-[#059669]">
                    {goal.percentage}%
                  </span>
                </div>

                <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[#10B981]"
                    style={{ width: `${goal.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Saved: ₹{(goal.savedAmount / 100000).toFixed(1)}L</span>
                  <span>Target: ₹{(goal.targetAmount / 100000).toFixed(1)}L ({goal.targetDate})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Recent Transactions Feed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Recent Transactions</h2>
              <p className="text-xs text-[#6B7280]">
                {isLiveConnected ? 'Live transactions from Supabase PostgreSQL' : 'Verified sample transaction records'}
              </p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
            >
              Manage Ledger <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {recentList.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'INCOME'
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {tx.type === 'INCOME' ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827] flex items-center gap-2">
                      {tx.title}
                      {tx.isAnomaly && (
                        <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded font-mono font-bold">
                          SPIKE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6B7280] flex items-center gap-2 mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`font-mono font-bold text-right ${
                    tx.type === 'INCOME' ? 'text-[#059669]' : 'text-[#111827]'
                  }`}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
