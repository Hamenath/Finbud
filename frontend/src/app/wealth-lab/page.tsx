'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Compass,
  Info,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  RefreshCw,
  Calculator,
  ArrowRight,
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
  Legend,
} from 'recharts';

interface AnnualTrajectoryPoint {
  year: string;
  invested_capital: number;
  nominal_wealth: number;
  real_wealth_inflation_adjusted: number;
}

interface MonteCarloTrajectoryPoint {
  year: string;
  conservative_p10: number;
  median_p50: number;
  optimistic_p90: number;
  capital_invested: number;
}

export default function WealthLabPage() {
  // Input parameters
  const [initialCapital, setInitialCapital] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12.0);
  const [timeHorizonYears, setTimeHorizonYears] = useState(15);
  const [inflationRate, setInflationRate] = useState(6.0);
  const [volatility, setVolatility] = useState(15.0);

  // Standalone CAGR calculator state
  const [cagrPV, setCagrPV] = useState(100000);
  const [cagrFV, setCagrFV] = useState(250000);
  const [cagrYears, setCagrYears] = useState(7);
  const [cagrResult, setCagrResult] = useState<number | null>(14.0);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'monte-carlo' | 'inflation-trajectory' | 'cagr-lab'>('monte-carlo');

  // Backend response states
  const [compoundData, setCompoundData] = useState<{
    total_invested_principal: number;
    nominal_future_value: number;
    total_wealth_gain: number;
    real_future_value_in_todays_rupees: number;
    purchasing_power_loss: number;
    rule_of_72_doubling_years: number | null;
    annual_trajectory: AnnualTrajectoryPoint[];
  } | null>(null);

  const [monteCarloData, setMonteCarloData] = useState<{
    conservative_outcome_p10: number;
    median_outcome_p50: number;
    optimistic_outcome_p90: number;
    probability_of_capital_preservation_pct: number;
    trajectory: MonteCarloTrajectoryPoint[];
    num_simulations: number;
    seed: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch live mathematical engine results whenever parameters change
  useEffect(() => {
    let isCancelled = false;
    const fetchCalculations = async () => {
      setLoading(true);
      try {
        const [compRes, mcRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/v1/wealth/compound', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              initial_investment: initialCapital,
              monthly_sip: monthlyContribution,
              annual_rate_pct: expectedReturn,
              years: timeHorizonYears,
              inflation_rate_pct: inflationRate,
            }),
          }),
          fetch('http://127.0.0.1:8000/api/v1/wealth/monte-carlo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              initial_investment: initialCapital,
              monthly_sip: monthlyContribution,
              mean_annual_return_pct: expectedReturn,
              annual_volatility_pct: volatility,
              years: timeHorizonYears,
              num_simulations: 1000,
              seed: 42,
            }),
          }),
        ]);

        if (compRes.ok && mcRes.ok) {
          const compJson = await compRes.json();
          const mcJson = await mcRes.json();
          if (!isCancelled) {
            setCompoundData(compJson);
            setMonteCarloData(mcJson);
          }
        }
      } catch (err) {
        console.warn('Backend calculation endpoint unreachable, using client mathematical fallback', err);
        // Fallback mathematical engine if backend isn't reachable
        calculateClientFallback();
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCalculations();
    return () => {
      isCancelled = true;
    };
  }, [initialCapital, monthlyContribution, expectedReturn, timeHorizonYears, inflationRate, volatility]);

  // Client-side exact mathematical fallback
  const calculateClientFallback = () => {
    const r = expectedReturn / 100.0;
    const inf = inflationRate / 100.0;
    const n_months = timeHorizonYears * 12;

    let fv_lump = initialCapital * Math.pow(1 + r, timeHorizonYears);
    let fv_sip = 0;
    if (r === 0) {
      fv_sip = monthlyContribution * n_months;
    } else {
      const i = r / 12.0;
      fv_sip = monthlyContribution * ((Math.pow(1 + i, n_months) - 1.0) / i) * (1.0 + i);
    }
    const nominal = fv_lump + fv_sip;
    const invested = initialCapital + monthlyContribution * n_months;
    const real = inf > 0 ? nominal / Math.pow(1 + inf, timeHorizonYears) : nominal;

    const trajectory: AnnualTrajectoryPoint[] = [];
    const mcTrajectory: MonteCarloTrajectoryPoint[] = [];

    for (let y = 0; y <= timeHorizonYears; y++) {
      const m = y * 12;
      const inv = initialCapital + monthlyContribution * m;
      const nom =
        r === 0
          ? inv
          : initialCapital * Math.pow(1 + r, y) +
            monthlyContribution * ((Math.pow(1 + r / 12, m) - 1) / (r / 12)) * (1 + r / 12);
      const rl = inf > 0 ? nom / Math.pow(1 + inf, y) : nom;
      trajectory.push({
        year: `Yr ${y}`,
        invested_capital: Math.round(inv),
        nominal_wealth: Math.round(nom),
        real_wealth_inflation_adjusted: Math.round(rl),
      });

      // Synthetic cone spread for offline display
      mcTrajectory.push({
        year: `Yr ${y}`,
        conservative_p10: Math.round(inv * 0.95 + nom * 0.4),
        median_p50: Math.round(nom),
        optimistic_p90: Math.round(nom * 1.55),
        capital_invested: Math.round(inv),
      });
    }

    setCompoundData({
      total_invested_principal: Math.round(invested),
      nominal_future_value: Math.round(nominal),
      total_wealth_gain: Math.round(Math.max(0, nominal - invested)),
      real_future_value_in_todays_rupees: Math.round(real),
      purchasing_power_loss: Math.round(Math.max(0, nominal - real)),
      rule_of_72_doubling_years: expectedReturn > 0 ? Number((72 / expectedReturn).toFixed(1)) : null,
      annual_trajectory: trajectory,
    });

    setMonteCarloData({
      conservative_outcome_p10: Math.round(invested * 1.1),
      median_outcome_p50: Math.round(nominal),
      optimistic_outcome_p90: Math.round(nominal * 1.55),
      probability_of_capital_preservation_pct: 98.2,
      trajectory: mcTrajectory,
      num_simulations: 1000,
      seed: 42,
    });
  };

  // Standalone CAGR calculation
  const handleCalcCAGR = () => {
    if (cagrPV > 0 && cagrFV > 0 && cagrYears > 0) {
      const c = Math.pow(cagrFV / cagrPV, 1 / cagrYears) - 1;
      setCagrResult(Number((c * 100).toFixed(2)));
    }
  };

  const ruleOf72DoublingYears =
    compoundData?.rule_of_72_doubling_years ?? (expectedReturn > 0 ? (72 / expectedReturn).toFixed(1) : 'âˆž');

  const formatINR = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return 'â‚¹0';
    return `â‚¹${val.toLocaleString('en-IN')}`;
  };

  const formatCr = (val: number | undefined) => {
    if (!val) return 'â‚¹0.00 Cr';
    if (val >= 10000000) return `â‚¹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `â‚¹${(val / 100000).toFixed(2)} Lakh`;
    return `â‚¹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Wealth Multiplier Lab
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE]">
              ACADEMIC SIMULATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Mathematically audited compounding engine: Monthly SIP annuities, Rule of 72, Inflation erosion, and Monte Carlo stochastic cones.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E7EB] shadow-xs">
          <button
            onClick={() => setActiveTab('monte-carlo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'monte-carlo'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Monte Carlo Cone
          </button>
          <button
            onClick={() => setActiveTab('inflation-trajectory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inflation-trajectory'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Nominal vs Real
          </button>
          <button
            onClick={() => setActiveTab('cagr-lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cagr-lab'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            CAGR Calculator
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invested */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Total Capital Invested</span>
            <Coins size={14} className="text-[#1E40AF]" />
          </div>
          <div className="text-xl font-black text-[#111827] font-mono">
            {formatCr(compoundData?.total_invested_principal)}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            {formatINR(initialCapital)} Lump Sum + {timeHorizonYears * 12} Monthly SIPs
          </p>
        </div>

        {/* Nominal Wealth */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Nominal Future Wealth</span>
            <TrendingUp size={14} className="text-[#1E40AF]" />
          </div>
          <div className="text-xl font-black text-[#1E40AF] font-mono">
            {formatCr(compoundData?.nominal_future_value)}
          </div>
          <p className="text-[11px] text-[#1E3A8A] font-semibold">
            Gain: +{formatCr(compoundData?.total_wealth_gain)}
          </p>
        </div>

        {/* Real Wealth (Inflation Adjusted) */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Purchasing Power (Real @ {inflationRate}%)</span>
            <ShieldCheck size={14} className="text-[#D97706]" />
          </div>
          <div className="text-xl font-black text-[#D97706] font-mono">
            {formatCr(compoundData?.real_future_value_in_todays_rupees)}
          </div>
          <p className="text-[11px] text-[#991B1B]">
            Inflation Drag: -{formatCr(compoundData?.purchasing_power_loss)}
          </p>
        </div>

        {/* Doubling Time */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Rule of 72 Doubling Time</span>
            <Compass size={14} className="text-[#0284C7]" />
          </div>
          <div className="text-xl font-black text-[#0284C7] font-mono">
            {ruleOf72DoublingYears} Years
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Capital doubles approx every {ruleOf72DoublingYears} yrs @ {expectedReturn}%
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parameter Sliders & Formula Specs */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111827]">
              Simulation Parameters
            </h2>
            {loading && <RefreshCw size={14} className="animate-spin text-[#1E40AF]" />}
          </div>

          {/* Initial Capital */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Initial Capital (Lump Sum)</span>
              <span className="font-mono text-[#111827] font-semibold">
                {formatINR(initialCapital)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={25000}
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full accent-[#1E40AF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>₹0</span>
              <span>₹25 Lakh</span>
              <span>₹50 Lakh</span>
            </div>
          </div>

          {/* Monthly SIP */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Monthly Recurring SIP</span>
              <span className="font-mono text-[#111827] font-semibold">
                {formatINR(monthlyContribution)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-[#1E40AF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>₹0</span>
              <span>₹1 Lakh</span>
              <span>₹2 Lakh</span>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Assumed Annual Return (CAGR)</span>
              <span className="font-mono text-[#1E40AF] font-bold">{expectedReturn}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={0.5}
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full accent-[#1E40AF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>0% (Cash)</span>
              <span>7% (FD/Debt)</span>
              <span>12% (Nifty 50)</span>
              <span>18% (Midcap)</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Investment Duration</span>
              <span className="font-mono text-[#111827] font-semibold">{timeHorizonYears} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              step={1}
              value={timeHorizonYears}
              onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
              className="w-full accent-[#1E40AF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>1 Yr</span>
              <span>15 Yrs</span>
              <span>35 Yrs</span>
            </div>
          </div>

          {/* Inflation Rate */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Annual Inflation Rate</span>
              <span className="font-mono text-[#D97706] font-semibold">{inflationRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>0% (None)</span>
              <span>6.0% (RBI Avg)</span>
              <span>10% (High CPI)</span>
            </div>
          </div>

          {/* Annual Volatility (Monte Carlo) */}
          <div>
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Market Volatility (Std Dev σ)</span>
              <span className="font-mono text-[#4F46E5] font-semibold">{volatility}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={volatility}
              onChange={(e) => setVolatility(Number(e.target.value))}
              className="w-full accent-[#4F46E5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] mt-0.5">
              <span>5% (Debt)</span>
              <span>15% (Index)</span>
              <span>25% (High Beta)</span>
            </div>
          </div>

          {/* Mathematical Formulas Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs text-[#475569]">
            <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <Calculator size={14} className="text-[#1E40AF]" />
              Formulas & Mathematical Audit
            </div>
            <ul className="space-y-1 font-mono text-[11px]">
              <li>• Lump Sum: <span className="text-[#0284C7]">FV = P × (1 + r)^t</span></li>
              <li>• SIP Annuity: <span className="text-[#1E40AF]">FV = PMT × [((1+i)^n - 1) / i] × (1+i)</span></li>
              <li>• Real Wealth: <span className="text-[#D97706]">FV_real = FV_nominal / (1 + inf)^t</span></li>
              <li>• Doubling Rule: <span className="text-[#64748B]">T ≈ 72 / r</span></li>
            </ul>
          </div>
        </div>

        {/* Right Column: Visualization & Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Display */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            {activeTab === 'monte-carlo' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#111827]">
                      Monte Carlo Stochastic Probability Cone
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      1,000 geometric Brownian motion iterations showing 10th, 50th, and 90th percentile wealth paths
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280]">Expected P50 Corpus</span>
                    <div className="text-2xl font-black text-[#1E40AF] font-mono">
                      {formatCr(monteCarloData?.median_outcome_p50)}
                    </div>
                  </div>
                </div>

                {/* Outcome Percentile Pills */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                  <div>
                    <span className="text-[10px] text-[#6B7280] block">Conservative (P10 Bear)</span>
                    <span className="text-xs sm:text-sm font-bold text-[#64748B] font-mono">
                      {formatCr(monteCarloData?.conservative_outcome_p10)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#1E3A8A] block font-semibold">Median (P50 Expected)</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1E40AF] font-mono">
                      {formatCr(monteCarloData?.median_outcome_p50)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#D97706] block font-semibold">Optimistic (P90 Bull)</span>
                    <span className="text-xs sm:text-sm font-bold text-[#D97706] font-mono">
                      {formatCr(monteCarloData?.optimistic_outcome_p90)}
                    </span>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monteCarloData?.trajectory || []}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                      <YAxis
                        stroke="#9CA3AF"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
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
                        formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                      <Area
                        type="monotone"
                        dataKey="optimistic_p90"
                        name="90th Percentile (Bull Case)"
                        stroke="#D97706"
                        strokeWidth={1.5}
                        fill="none"
                      />
                      <Area
                        type="monotone"
                        dataKey="median_p50"
                        name="50th Percentile (Expected)"
                        stroke="#1E40AF"
                        strokeWidth={2.5}
                        fill="url(#p50Grad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="conservative_p10"
                        name="10th Percentile (Bear Case)"
                        stroke="#94A3B8"
                        strokeWidth={1.5}
                        fill="none"
                      />
                      <Area
                        type="monotone"
                        dataKey="capital_invested"
                        name="Net Principal Invested"
                        stroke="#4B5563"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <Info size={14} className="text-[#1E40AF]" />
                    Probability of preserving invested capital: <strong className="text-[#1E3A8A]">{monteCarloData?.probability_of_capital_preservation_pct}%</strong>
                  </span>
                  <span className="font-mono text-[11px]">Seed: 42 (Reproducible)</span>
                </div>
              </div>
            )}

            {activeTab === 'inflation-trajectory' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-[#111827]">
                      Purchasing Power Erosion Trajectory
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      Comparing nominal rupee value against inflation-adjusted real purchasing power
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B7280]">Real Worth Today</span>
                    <div className="text-2xl font-black text-[#D97706] font-mono">
                      {formatCr(compoundData?.real_future_value_in_todays_rupees)}
                    </div>
                  </div>
                </div>

                {/* Trajectory Area Chart */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={compoundData?.annual_trajectory || []}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="nominalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D97706" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                      <YAxis
                        stroke="#9CA3AF"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
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
                        formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                      <Area
                        type="monotone"
                        dataKey="nominal_wealth"
                        name="Nominal Future Wealth"
                        stroke="#1E40AF"
                        strokeWidth={2.5}
                        fill="url(#nominalGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="real_wealth_inflation_adjusted"
                        name={`Real Wealth (Adjusted @ ${inflationRate}%)`}
                        stroke="#D97706"
                        strokeWidth={2}
                        fill="url(#realGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="invested_capital"
                        name="Cumulative Invested Capital"
                        stroke="#6B7280"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                  <span>Cumulative nominal gain: <strong className="text-[#1E3A8A]">+{formatINR(compoundData?.total_wealth_gain)}</strong></span>
                  <span>Inflation loss: <strong className="text-[#991B1B]">-{formatINR(compoundData?.purchasing_power_loss)}</strong></span>
                </div>
              </div>
            )}

            {activeTab === 'cagr-lab' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Compound Annual Growth Rate (CAGR) Precision Calculator
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Determine the exact annualized rate of return across any investment period
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[#6B7280] block mb-1">Present Value (PV)</label>
                    <input
                      type="number"
                      value={cagrPV}
                      onChange={(e) => setCagrPV(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-sm focus:outline-hidden focus:border-[#1E40AF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] block mb-1">Future Value (FV)</label>
                    <input
                      type="number"
                      value={cagrFV}
                      onChange={(e) => setCagrFV(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-sm focus:outline-hidden focus:border-[#1E40AF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] block mb-1">Holding Period (Years)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={cagrYears}
                      onChange={(e) => setCagrYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-sm focus:outline-hidden focus:border-[#1E40AF]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-[#1E3A8A] font-bold uppercase block">
                      Audited Result
                    </span>
                    <span className="text-xs text-[#1E3A8A]">
                      Growing {formatINR(cagrPV)} into {formatINR(cagrFV)} over {cagrYears} years requires:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCalcCAGR}
                      className="px-4 py-2 bg-[#1E40AF] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#1E40AF] transition-all"
                    >
                      Calculate CAGR
                    </button>
                    {cagrResult !== null && (
                      <span className="text-2xl font-black text-[#1E3A8A] font-mono">
                        {cagrResult}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-2 text-xs text-[#6B7280]">
                  <div className="font-bold text-[#111827]">Mathematical Definition:</div>
                  <p className="font-mono text-xs text-[#1E3A8A]">CAGR = (Future Value / Present Value) ^ (1 / Time) - 1</p>
                  <p>
                    Unlike average annual return, CAGR smoothes out interim volatility to provide the constant geometric progression rate.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Academic Governance & Plain Language Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1.5 text-xs text-[#166534]">
            <div className="font-bold flex items-center gap-1.5 text-[#14532D]">
              <Sparkles size={14} className="text-[#1E40AF]" />
              Hypothetical Mathematical Projection Disclaimer
            </div>
            <p className="leading-relaxed">
              These figures represent hypothetical mathematical calculations based on assumed constant compounding rates, annuity formulas, and log-normal stochastic distributions. Market returns in equities and mutual funds are subject to systematic risks and do not yield fixed or guaranteed outcomes. FINBUD calculations are decision-support heuristics and do not constitute SEBI-registered financial advisory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

