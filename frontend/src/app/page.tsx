'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Database,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Activity,
  CreditCard,
  Lock,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DEMO_OVERVIEW_METRICS,
  DEMO_CASH_FLOW,
  DEMO_TRANSACTIONS,
} from '@/data/demoData';
import { createClient } from '@/utils/supabase/client';

// Card 1: Revenue Line Data
const REVENUE_SERIES = [
  { day: '1', val: 12000 },
  { day: '4', val: 18000 },
  { day: '8', val: 15000 },
  { day: '12', val: 24000 },
  { day: '16', val: 22000 },
  { day: '20', val: 32000 },
  { day: '24', val: 29000 },
  { day: '28', val: 41000 },
  { day: '30', val: 48000 },
];

// Card 2: Subscription Growth Data
const SUBSCRIPTION_SERIES = [
  { day: '1', count: 1210 },
  { day: '5', count: 1350 },
  { day: '10', count: 1480 },
  { day: '15', count: 1620 },
  { day: '20', count: 1890 },
  { day: '25', count: 2140 },
  { day: '30', count: 2350 },
];

// Card 3: Move Goal Bar Data
const MOVE_GOAL_BARS = [
  { day: 'M', value: 380 },
  { day: 'T', value: 450 },
  { day: 'W', value: 510 },
  { day: 'T', value: 340 },
  { day: 'F', value: 490 },
  { day: 'S', value: 580 },
  { day: 'S', value: 520 },
];

// Card 4: Exercise Minutes Two-Series Data
const EXERCISE_SERIES = [
  { day: 'Mon', current: 35, previous: 25 },
  { day: 'Tue', current: 50, previous: 30 },
  { day: 'Wed', current: 40, previous: 45 },
  { day: 'Thu', current: 65, previous: 35 },
  { day: 'Fri', current: 55, previous: 40 },
  { day: 'Sat', current: 80, previous: 60 },
  { day: 'Sun', current: 70, previous: 50 },
];

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [realTransactions, setRealTransactions] = useState<any[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Card 3 State: Move Goal Interactive Counter
  const [moveGoal, setMoveGoal] = useState<number>(450);

  // Forms State
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [upgradeName, setUpgradeName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

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
        revenue: '₹2,45,000',
        revenueChange: '+12.5%',
        subscriptions: '2,350',
        subGrowth: '+18.2%',
        burnRate: '₹1,32,400',
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

    return {
      isDemo: false,
      revenue: `₹${income.toLocaleString('en-IN')}`,
      revenueChange: '+8.4%',
      subscriptions: `${realTransactions.length}`,
      subGrowth: '+5.1%',
      burnRate: `₹${expense.toLocaleString('en-IN')}`,
      netSavings: `₹${netSavings.toLocaleString('en-IN')}`,
    };
  }, [isLiveConnected, realTransactions]);

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback('Subscription upgrade request processed.');
    setTimeout(() => setFormFeedback(null), 3000);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback('Account creation initiated.');
    setTimeout(() => setFormFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* 1. Header Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#191B25]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F6FF] tracking-tight">
            Telemetry & Financial Performance
          </h1>
          <p className="text-xs text-[#71809B] mt-0.5">
            Real-time analytics engine • Verified statement period November 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#A9BCE0] bg-[#10131D] border border-[#191B25]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0033FF] animate-pulse" />
              Demo Benchmark
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#F4F6FF] bg-[#10245C] border border-[#0033FF]/40">
              <Database size={11} className="text-[#0033FF]" />
              Live PostgreSQL
            </span>
          )}
        </div>
      </div>

      {formFeedback && (
        <div className="p-3 rounded-xl bg-[#10245C] border border-[#0033FF]/40 text-xs text-[#F4F6FF] font-medium animate-fadeIn">
          {formFeedback}
        </div>
      )}

      {/* 2. THE 4 PRIMARY DASHBOARD CARDS (Exact 2x2 Grid from Spec) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1 — TOTAL REVENUE */}
        <div className="dark-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A9BCE0] mb-1 font-medium">
              <span>Total Revenue</span>
              <span className="text-[11px] font-mono text-[#0033FF] font-semibold">
                {metrics.revenueChange}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F4F6FF] tracking-tight">
              {metrics.revenue}
            </div>
            <p className="text-xs text-[#71809B] mt-1">
              +₹32,450 from last reporting month
            </p>
          </div>

          <div className="h-36 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonBlueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0033FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0033FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0D14',
                    borderColor: '#191B25',
                    borderRadius: '8px',
                    color: '#F4F6FF',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#0033FF"
                  strokeWidth={2}
                  fill="url(#neonBlueFill)"
                  dot={{ r: 2.5, fill: '#0033FF', stroke: '#0B0D14', strokeWidth: 1 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 2 — SUBSCRIPTIONS */}
        <div className="dark-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A9BCE0] mb-1 font-medium">
              <span>Subscriptions</span>
              <span className="text-[11px] font-mono text-[#0033FF] font-semibold">
                {metrics.subGrowth}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F4F6FF] tracking-tight">
              +{metrics.subscriptions}
            </div>
            <p className="text-xs text-[#71809B] mt-1">
              +180.1% from previous cycle
            </p>
          </div>

          <div className="h-36 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SUBSCRIPTION_SERIES} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0D14',
                    borderColor: '#191B25',
                    borderRadius: '8px',
                    color: '#F4F6FF',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0033FF"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0033FF', stroke: '#0B0D14', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CARD 3 — MOVE GOAL */}
        <div className="dark-card flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F6FF]">Move Goal</h2>
            <p className="text-xs text-[#71809B]">Set your daily activity goal</p>
          </div>

          {/* Centered Goal Counter */}
          <div className="flex items-center justify-center gap-6 py-2">
            <button
              onClick={() => setMoveGoal((g) => Math.max(100, g - 25))}
              className="w-8 h-8 rounded-full border border-[#191B25] bg-[#05060A] hover:bg-[#10131D] hover:border-[#0033FF] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Decrease goal"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#F4F6FF] tracking-tight font-mono">
                {moveGoal}
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#71809B]">
                CALORIES/DAY
              </div>
            </div>

            <button
              onClick={() => setMoveGoal((g) => g + 25)}
              className="w-8 h-8 rounded-full border border-[#191B25] bg-[#05060A] hover:bg-[#10131D] hover:border-[#0033FF] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Increase goal"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Electric Blue Vertical Bar Chart */}
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOVE_GOAL_BARS} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <Bar
                  dataKey="value"
                  fill="#0033FF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={() => {
              setFormFeedback(`Daily move goal saved: ${moveGoal} cal/day.`);
              setTimeout(() => setFormFeedback(null), 3000);
            }}
            className="w-full btn-electric text-xs py-2.5 cursor-pointer text-center"
          >
            Set Goal
          </button>
        </div>

        {/* CARD 4 — EXERCISE MINUTES */}
        <div className="dark-card flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[#F4F6FF]">Exercise Minutes</h2>
            <p className="text-xs text-[#71809B]">Your exercise minutes are ahead of last week</p>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EXERCISE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#191B25" vertical={false} />
                <XAxis dataKey="day" stroke="#71809B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71809B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0D14',
                    borderColor: '#191B25',
                    borderRadius: '8px',
                    color: '#F4F6FF',
                    fontSize: '11px',
                  }}
                />
                {/* Primary Electric Blue Solid Line */}
                <Line
                  type="monotone"
                  dataKey="current"
                  name="This Week"
                  stroke="#0033FF"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0033FF', stroke: '#0B0D14', strokeWidth: 1 }}
                />
                {/* Secondary Blue Dashed Line */}
                <Line
                  type="monotone"
                  dataKey="previous"
                  name="Last Week"
                  stroke="#1744B8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={{ r: 2.5, fill: '#1744B8', stroke: '#0B0D14' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#71809B] pt-2 border-t border-[#191B25] font-mono">
            <span>Weekly Target: 300 min</span>
            <span className="text-[#0033FF] font-semibold">395 min achieved</span>
          </div>
        </div>
      </div>

      {/* 3. FORMS SECTION (Side-by-Side Dark Form Cards from Spec) */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-sm font-semibold text-[#F4F6FF] uppercase tracking-wider">
            Forms
          </h2>
          <p className="text-xs text-[#71809B]">Institutional checkout & access authorization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CARD 1 — UPGRADE YOUR SUBSCRIPTION */}
          <div className="dark-card space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[#F4F6FF]">
                Upgrade your subscription
              </h3>
              <p className="text-xs text-[#71809B] mt-0.5">
                Unlock full financial telemetry, Monte Carlo projections and multi-asset automation.
              </p>
            </div>

            <form onSubmit={handleUpgradeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="First and last name"
                  value={upgradeName}
                  onChange={(e) => setUpgradeName(e.target.value)}
                  className="w-full dark-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@organization.com"
                  value={upgradeEmail}
                  onChange={(e) => setUpgradeEmail(e.target.value)}
                  className="w-full dark-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Card number
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full dark-input font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full dark-input font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                    CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full dark-input font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-electric text-xs py-2.5 cursor-pointer text-center"
                >
                  Upgrade subscription
                </button>
              </div>
            </form>
          </div>

          {/* CARD 2 — CREATE AN ACCOUNT */}
          <div className="dark-card space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[#F4F6FF]">
                Create an account
              </h3>
              <p className="text-xs text-[#71809B] mt-0.5">
                Enter your email below to create your account or continue with federated providers.
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormFeedback('GitHub OAuth connection simulated.');
                  setTimeout(() => setFormFeedback(null), 3000);
                }}
                className="btn-charcoal text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormFeedback('Google OAuth connection simulated.');
                  setTimeout(() => setFormFeedback(null), 3000);
                }}
                className="btn-charcoal text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#191B25]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-[#0B0D14] px-2 text-[#71809B]">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Account Form */}
            <form onSubmit={handleAccountSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="m@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full dark-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F6FF] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full dark-input font-mono"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-electric text-xs py-2.5 cursor-pointer text-center"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
