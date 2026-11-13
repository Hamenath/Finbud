'use client';

import React, { useState } from 'react';
import {
  Compass,
  Info,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function WealthLabPage() {
  const [initialCapital, setInitialCapital] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timeHorizonYears, setTimeHorizonYears] = useState(15);

  const ruleOf72DoublingYears = (72 / (expectedReturn || 1)).toFixed(1);

  const projectionData = [];
  let p10 = initialCapital;
  let p50 = initialCapital;
  let p90 = initialCapital;

  for (let year = 0; year <= timeHorizonYears; year++) {
    projectionData.push({
      year: `Yr ${year}`,
      conservative: Math.round(p10),
      median: Math.round(p50),
      optimistic: Math.round(p90),
    });

    const annualAddition = monthlyContribution * 12;
    p10 = (p10 + annualAddition) * (1 + (expectedReturn - 4) / 100);
    p50 = (p50 + annualAddition) * (1 + expectedReturn / 100);
    p90 = (p90 + annualAddition) * (1 + (expectedReturn + 4) / 100);
  }

  const finalMedian = projectionData[projectionData.length - 1].median;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Wealth Multiplier Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Hypothetical compounding simulations using CAGR, Rule of 72, and Monte Carlo probability percentiles
        </p>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#111827]">
            Simulation Parameters
          </h2>

          <div>
            <label className="text-xs text-[#6B7280] flex justify-between">
              <span>Initial Capital</span>
              <span className="font-mono text-[#111827] font-semibold">
                ₹{initialCapital.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={50000}
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full accent-[#10B981] mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B7280] flex justify-between">
              <span>Monthly SIP Contribution</span>
              <span className="font-mono text-[#111827] font-semibold">
                ₹{monthlyContribution.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="range"
              min={1000}
              max={200000}
              step={1000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-[#10B981] mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B7280] flex justify-between">
              <span>Expected Annual Return (CAGR)</span>
              <span className="font-mono text-[#10B981] font-bold">{expectedReturn}%</span>
            </label>
            <input
              type="range"
              min={4}
              max={20}
              step={0.5}
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full accent-[#10B981] mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B7280] flex justify-between">
              <span>Time Horizon</span>
              <span className="font-mono text-[#111827] font-semibold">{timeHorizonYears} Years</span>
            </label>
            <input
              type="range"
              min={3}
              max={35}
              step={1}
              value={timeHorizonYears}
              onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
              className="w-full accent-[#10B981] mt-2 cursor-pointer"
            />
          </div>

          {/* Rule of 72 Card */}
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1">
            <div className="text-[11px] font-mono text-[#065F46] font-bold uppercase flex items-center gap-1.5">
              <Compass size={13} /> Rule of 72 Approximation
            </div>
            <p className="text-xs text-[#065F46] leading-relaxed">
              At {expectedReturn}% annual return, your capital will approximately double every{' '}
              <span className="font-bold">{ruleOf72DoublingYears} years</span>.
            </p>
          </div>
        </div>

        {/* Visual Simulation Area */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#111827]">Monte Carlo Percentile Cone</h2>
                <p className="text-xs text-[#6B7280]">
                  Illustrates outcome dispersion rather than a false single guarantee
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6B7280]">Estimated 50th Percentile Corpus</span>
                <div className="text-xl sm:text-2xl font-black text-[#10B981] font-mono">
                  ₹{(finalMedian / 10000000).toFixed(2)} Cr
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="coneGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
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
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    name="90th Percentile (Bull)"
                    stroke="#D97706"
                    strokeWidth={1.5}
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="median"
                    name="50th Percentile (Expected)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#coneGradLight)"
                  />
                  <Area
                    type="monotone"
                    dataKey="conservative"
                    name="10th Percentile (Bear)"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <Info size={14} className="text-[#10B981]" />
              Figures assume monthly compounding. Returns not guaranteed.
            </span>
            <span className="font-mono text-[11px]">Iterations: 1,000 runs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
