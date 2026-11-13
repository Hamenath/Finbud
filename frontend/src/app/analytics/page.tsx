'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sparkles, BrainCircuit, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';

const CATEGORY_SPENDING = [
  { category: 'Housing & Rent', amount: 48500, average: 48000, anomaly: false },
  { category: 'Food & Dining', amount: 28400, average: 18000, anomaly: true },
  { category: 'Investments/SIP', amount: 35000, average: 30000, anomaly: false },
  { category: 'Precious Metals', amount: 38710, average: 15000, anomaly: false },
  { category: 'Utilities', amount: 6200, average: 5800, anomaly: false },
  { category: 'Transport', amount: 8400, average: 9200, anomaly: false },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Machine Learning & Spend Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Predictive time-series regression and Scikit-Learn Isolation Forest category surveillance
        </p>
      </div>

      {/* Model Health / Academic Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="text-xs text-[#6B7280]">Forecasting Model Metric</div>
          <div className="text-xl font-bold text-[#111827] mt-1">MAE: ₹3,420</div>
          <div className="text-[11px] text-[#059669] mt-1 flex items-center gap-1 font-mono">
            <ArrowUpRight size={12} /> 94.6% Accuracy on Holdout Set
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="text-xs text-[#6B7280]">Anomaly Detection Engine</div>
          <div className="text-xl font-bold text-[#D97706] mt-1">Isolation Forest</div>
          <div className="text-[11px] text-[#6B7280] mt-1 font-mono">
            Contamination Ratio: 0.05
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="text-xs text-[#6B7280]">Spending Burn Velocity</div>
          <div className="text-xl font-bold text-[#10B981] mt-1">₹4,413 / Day</div>
          <div className="text-[11px] text-[#6B7280] mt-1 font-mono">
            Pacing within 50/30/20 guideline
          </div>
        </div>
      </div>

      {/* Main Analytics Chart: Category Spending vs Baseline Average */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Current Month Category vs 6-Month Baseline</h2>
            <p className="text-xs text-[#6B7280]">Identifies spending spikes deviating from personal historical norm</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
              <span className="text-[#374151]">Current Spend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#94A3B8]" />
              <span className="text-[#6B7280]">6M Historical Avg</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CATEGORY_SPENDING} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
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
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="average" name="Baseline Average" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="amount" name="Current Month" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
