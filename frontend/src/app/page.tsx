'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  PiggyBank,
  AlertTriangle,
  ChevronRight,
  PieChart as PieChartIcon,
  Shield,
  Coins,
  Bot,
  Sparkles,
  Layers,
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
  Legend,
} from 'recharts';
import {
  DEMO_OVERVIEW_METRICS,
  DEMO_CASH_FLOW,
  DEMO_ASSET_ALLOCATION,
  DEMO_TRANSACTIONS,
  DEMO_FINANCIAL_GOALS,
} from '@/data/demoData';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Quick Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Predictive cash-flow intelligence & multi-asset wealth monitoring
          </p>
        </div>

        {/* Demo Data Pill & Action */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-[#F59E0B] border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            DEMO DATA VERIFIED
          </span>
          <Link
            href="/finbud-ai"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141418] hover:bg-[#1E1E28] border border-[#262636] text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Bot size={15} className="text-[#F59E0B]" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (Matches Screenshot Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D] relative overflow-hidden group hover:border-[#333342] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Total Net Worth</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight size={13} />
              +1.5% MoM
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            {DEMO_OVERVIEW_METRICS.netWorth}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Performance (YTD)</span>
            <span className="text-white font-medium">{DEMO_OVERVIEW_METRICS.benchmarkComparison}</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D] relative overflow-hidden group hover:border-[#333342] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Monthly Inflow</span>
            <span className="text-emerald-400 font-mono text-[11px]">Primary + Dividends</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-sans">
            {DEMO_OVERVIEW_METRICS.monthlyIncome}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Verified Source</span>
            <span className="text-white font-medium">Infosys Salary</span>
          </div>
        </div>

        {/* Monthly Burn / Outflow */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D] relative overflow-hidden group hover:border-[#333342] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Monthly Outflow (Burn)</span>
            <span className="text-rose-400 font-mono text-[11px]">-3.2% vs Budget</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight font-sans">
            {DEMO_OVERVIEW_METRICS.monthlyExpense}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Estimated Month-End</span>
            <span className="text-white font-medium">₹1,33,500 (Linear ML)</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D] relative overflow-hidden group hover:border-[#333342] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Savings & Surplus Rate</span>
            <span className="text-[#F59E0B] font-mono text-[11px] font-semibold">Healthy Range</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F59E0B] tracking-tight font-sans">
            {DEMO_OVERVIEW_METRICS.savingsRate}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Recommended Benchmark</span>
            <span className="text-white font-medium">≥ 30% Inflow</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Cash-Flow Actual vs Forecast & Asset Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast Chart (2 Columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Cash Flow Forecast & Burn Rate
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  ACTUAL VS PREDICTED
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Past 5 months actuals against Ridge regression baseline forecast
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-neutral-300">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span className="text-neutral-300">Actual Outflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#F59E0B] border-t-2 border-dashed border-[#F59E0B]" />
                <span className="text-[#F59E0B]">Forecast</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_CASH_FLOW} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#22222E" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748B"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141418',
                    borderColor: '#2E2E3C',
                    borderRadius: '12px',
                    color: '#FFF',
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
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="forecastExpense"
                  name="Forecast Expense"
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation Donut (1 Column - matches user uploaded screenshot) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141418] border border-[#22222D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Asset Allocation</h2>
              <span className="text-[10px] text-neutral-400 font-mono">DIVERSIFICATION</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">Real-time multi-asset portfolio breakdown</p>

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
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#141418" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141418',
                      borderColor: '#2E2E3C',
                      borderRadius: '10px',
                      color: '#FFF',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-white">₹1.25 Cr</span>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest">Total Assets</span>
              </div>
            </div>

            {/* Asset Breakdown List */}
            <div className="space-y-2 mt-4">
              {DEMO_ASSET_ALLOCATION.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-300 truncate max-w-37.5">{item.category}</span>
                  </div>
                  <span className="font-mono font-semibold text-white">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/wealth-lab"
            className="mt-5 w-full py-2.5 rounded-xl bg-[#1C1C24] hover:bg-[#252532] border border-[#2B2B38] text-xs font-semibold text-center text-white transition-all block"
          >
            Rebalance in Wealth Lab
          </Link>
        </div>
      </div>

      {/* 4. Bottom Section: Financial Goals & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Goals Milestone Tracker */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Financial Goals</h2>
              <p className="text-xs text-neutral-400">Tracking long-term compounding milestones</p>
            </div>
            <Link
              href="/wealth-lab"
              className="text-xs font-semibold text-[#F59E0B] hover:underline flex items-center gap-1"
            >
              Simulate <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {DEMO_FINANCIAL_GOALS.map((goal) => (
              <div
                key={goal.id}
                className="p-3.5 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{goal.name}</span>
                  <span className="font-mono font-bold" style={{ color: goal.color }}>
                    {goal.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#1A1A24] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${goal.percentage}%`, backgroundColor: goal.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Saved: ₹{(goal.savedAmount / 100000).toFixed(1)}L</span>
                  <span>Target: ₹{(goal.targetAmount / 100000).toFixed(1)}L ({goal.targetDate})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recent Transactions</h2>
              <p className="text-xs text-neutral-400">Live feed across verified accounts</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-[#F59E0B] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-[#1F1F2A]">
            {DEMO_TRANSACTIONS.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'INCOME'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : tx.isAnomaly
                        ? 'bg-amber-500/15 text-[#F59E0B] border border-amber-500/30'
                        : 'bg-[#1C1C26] text-neutral-400 border border-[#282836]'
                    }`}
                  >
                    {tx.type === 'INCOME' ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {tx.title}
                      {tx.isAnomaly && (
                        <span className="text-[10px] bg-amber-500/20 text-[#F59E0B] px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                          <AlertTriangle size={10} /> ANOMALY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`font-mono font-bold text-right ${
                    tx.type === 'INCOME' ? 'text-emerald-400' : 'text-neutral-200'
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
