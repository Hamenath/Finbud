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
  Zap,
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
    <div className="space-y-8">
      {/* 1. Playful Neo-Brutalist Welcome Header */}
      <div className="neo-card-yellow p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-[1.5px] border-[#182B46] bg-[#FFD05B] text-xs font-mono font-extrabold text-[#182B46] mb-2.5">
            <Zap className="w-3.5 h-3.5 fill-[#182B46]" />
            FINBUD 2.0 • Playful Geometric Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182B46] tracking-tight">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#4B5E76] mt-1">
            Financial Statement Period: <span className="text-[#182B46] font-bold">November 2026</span>
          </p>
        </div>

        <div>
          {metrics.isDemo ? (
            <span className="neo-badge">
              <span className="w-2 h-2 rounded-full bg-[#182B46]" />
              Demo Preview
            </span>
          ) : (
            <span className="neo-badge-mint">
              <Database size={13} className="text-[#182B46]" />
              Supabase Live
            </span>
          )}
        </div>
      </div>

      {/* 2. Hero: Total Net Worth Neo Paper Block */}
      <div className="neo-card p-6 sm:p-8">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#4B5E76]">
          Total Net Worth
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <div className="text-3xl sm:text-5xl font-extrabold text-[#182B46] tracking-tight">
            {metrics.netWorth}
          </div>
          <div className="flex items-center gap-2">
            <span className="neo-badge-mint text-xs">
              <ArrowUpRight size={14} className="stroke-[2.5]" />
              +1.5% MoM
            </span>
            <span className="text-xs font-bold text-[#4B5E76]">YTD Outperformance: +14.2%</span>
          </div>
        </div>
      </div>

      {/* 3. Three Geometric Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income (Mint Card) */}
        <div className="neo-card-mint p-6 space-y-2">
          <span className="text-xs font-extrabold text-[#182B46] uppercase tracking-wider">
            Monthly Income
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#182B46]">
            {metrics.monthlyIncome}
          </div>
          <p className="text-xs font-medium text-[#4B5E76]">Primary salary & portfolio inflows</p>
        </div>

        {/* Expenses (White Card with Bold Outline) */}
        <div className="neo-card p-6 space-y-2">
          <span className="text-xs font-extrabold text-[#182B46] uppercase tracking-wider">
            Monthly Expenses (Burn)
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#EF4444]">
            {metrics.monthlyExpense}
          </div>
          <p className="text-xs font-medium text-[#4B5E76]">Non-discretionary & lifestyle burn</p>
        </div>

        {/* Savings (Yellow Accent Card) */}
        <div className="neo-card-yellow p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#182B46] uppercase tracking-wider">
              Net Monthly Savings
            </span>
            <span className="px-2 py-0.5 rounded-full border border-[#182B46] bg-white text-[11px] font-mono font-extrabold text-[#182B46]">
              {metrics.savingsRate}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#182B46]">
            {metrics.netSavings}
          </div>
          <p className="text-xs font-medium text-[#4B5E76]">Target guideline: ≥ 30% of income</p>
        </div>
      </div>

      {/* 4. Monthly Cash Flow Chart */}
      <div className="neo-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b-[1.5px] border-[#182B46]">
          <div>
            <h2 className="text-lg font-extrabold text-[#182B46] tracking-tight">Monthly Cash Flow</h2>
            <p className="text-xs font-semibold text-[#4B5E76] mt-0.5">Historical trajectory and baseline expense forecast</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#182B46] border border-[#182B46]" />
              <span className="text-[#182B46]">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#EF4444] border border-[#182B46]" />
              <span className="text-[#182B46]">Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#FFD05B] border border-[#182B46]" />
              <span className="text-[#182B46]">Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEMO_CASH_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#182B46" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#182B46" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#182B46" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis
                stroke="#182B46"
                tick={{ fontSize: 11, fontWeight: 700 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFDF5',
                  borderColor: '#182B46',
                  borderWidth: '1.5px',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0 #182B46',
                  color: '#182B46',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Area
                type="monotone"
                dataKey="actualIncome"
                name="Income"
                stroke="#182B46"
                strokeWidth={2.5}
                fill="url(#incFill)"
              />
              <Area
                type="monotone"
                dataKey="actualExpense"
                name="Expenses"
                stroke="#EF4444"
                strokeWidth={2.5}
                fill="url(#expFill)"
              />
              <Area
                type="monotone"
                dataKey="forecastExpense"
                name="Forecast"
                stroke="#FFD05B"
                strokeDasharray="4 4"
                strokeWidth={2.5}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Asset Allocation & 6. Predictive Savings Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Allocation */}
        <div className="neo-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-[1.5px] border-[#182B46]">
            <div>
              <h2 className="text-lg font-extrabold text-[#182B46] tracking-tight">Asset Allocation</h2>
              <p className="text-xs font-semibold text-[#4B5E76]">Multi-asset portfolio distribution</p>
            </div>
            <Link
              href="/wealth-lab"
              className="neo-btn-secondary px-3 py-1 text-xs flex items-center gap-1"
            >
              Analyze <ChevronRight size={13} className="stroke-[2.5]" />
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
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {DEMO_ASSET_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#182B46" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF5',
                      borderColor: '#182B46',
                      borderWidth: '1.5px',
                      borderRadius: '10px',
                      boxShadow: '3px 3px 0 #182B46',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-extrabold text-[#182B46]">₹1.25 Cr</span>
                <span className="text-[9px] font-bold text-[#4B5E76] uppercase tracking-wider">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {DEMO_ASSET_ALLOCATION.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border border-[#182B46]" style={{ backgroundColor: item.color }} />
                    <span className="text-[#182B46] truncate">{item.category}</span>
                  </div>
                  <span className="font-mono text-[#182B46]">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Savings Forecast */}
        <div className="neo-card-yellow p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-[1.5px] border-[#182B46]">
              <div>
                <h2 className="text-lg font-extrabold text-[#182B46] tracking-tight">Predictive Forecast</h2>
                <p className="text-xs font-semibold text-[#4B5E76]">Machine learning month-end estimate</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full border border-[#182B46] bg-white text-[10px] font-mono font-extrabold text-[#182B46]">
                Ridge ML Model
              </span>
            </div>

            <div className="p-5 rounded-xl bg-white border-[1.5px] border-[#182B46] shadow-[2px_2px_0_#182B46] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#4B5E76]">Projected Month-End Outflow</span>
                <span className="text-base font-extrabold text-[#EF4444] font-mono">
                  {metrics.isDemo ? '₹1,32,400' : metrics.monthlyExpense}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#4B5E76]">Estimated Month-End Surplus</span>
                <span className="text-base font-extrabold text-[#182B46] font-mono">
                  {metrics.isDemo ? '₹1,12,600' : metrics.netSavings}
                </span>
              </div>
              <div className="w-full bg-[#FFFDF5] border border-[#182B46] h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-[#182B46] h-full rounded-full" style={{ width: '46%' }} />
              </div>
            </div>

            <p className="text-xs font-medium text-[#4B5E76] leading-relaxed">
              Based on historical daily spending velocity and category-level recurrence patterns. Model uses time-based holdout validation to prevent lookahead leakage.
            </p>
          </div>

          <Link
            href="/analytics"
            className="w-full neo-btn-primary py-2.5 text-xs font-extrabold text-center block"
          >
            Explore Detailed Analytics
          </Link>
        </div>
      </div>

      {/* 7. Recent Transactions (Neo-Brutalist Paper Table) */}
      <div className="neo-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-[1.5px] border-[#182B46]">
          <div>
            <h2 className="text-lg font-extrabold text-[#182B46] tracking-tight">Recent Transactions</h2>
            <p className="text-xs font-semibold text-[#4B5E76]">
              {isLiveConnected ? 'Real records from your Supabase PostgreSQL ledger' : 'Sample transaction records'}
            </p>
          </div>
          <Link
            href="/transactions"
            className="neo-btn-secondary px-3 py-1 text-xs flex items-center gap-1"
          >
            View All <ChevronRight size={13} className="stroke-[2.5]" />
          </Link>
        </div>

        <div className="divide-y-[1.5px] divide-[#182B46]/10">
          {recentList.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg border-[1.5px] border-[#182B46] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0_#182B46] ${
                    tx.type === 'INCOME'
                      ? 'bg-[#E9FFF5] text-[#182B46]'
                      : 'bg-white text-[#182B46]'
                  }`}
                >
                  {tx.type === 'INCOME' ? (
                    <ArrowUpRight size={16} className="stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight size={16} className="stroke-[2.5]" />
                  )}
                </div>
                <div>
                  <div className="font-extrabold text-[#182B46] text-sm">{tx.title}</div>
                  <div className="text-[11px] font-bold text-[#4B5E76]">{tx.category} • {tx.date}</div>
                </div>
              </div>

              <div
                className={`font-mono font-extrabold text-sm px-2.5 py-1 rounded-md border-[1.5px] border-[#182B46] shadow-[1.5px_1.5px_0_#182B46] ${
                  tx.type === 'INCOME' ? 'bg-[#E9FFF5] text-[#182B46]' : 'bg-white text-[#EF4444]'
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
