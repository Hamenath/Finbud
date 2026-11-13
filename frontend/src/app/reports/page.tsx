'use client';

import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle,
  Award,
  TrendingUp,
  Shield,
  Coins,
} from 'lucide-react';
import { DEMO_OVERVIEW_METRICS } from '@/data/demoData';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Health Scorecard & Reports
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Comprehensive audit-ready monthly performance summary and PDF scorecard generator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1E1E28] border border-[#262636] text-xs font-semibold text-white transition-all"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert('PDF Scorecard Export initiated: FINBUD_November_2026_Report.pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 transition-all"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Sheet */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#141418] border border-[#22222D] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#22222D] gap-4">
          <div>
            <div className="text-[11px] font-mono text-[#F59E0B] font-bold tracking-widest uppercase">
              ACADEMIC PROTOTYPE FINANCIAL AUDIT
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Monthly Financial Health Report</h2>
            <p className="text-xs text-neutral-400">Statement Period: 01 Nov 2026 – 30 Nov 2026</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400">FINBUD Health Index</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">88 / 100</div>
            <span className="text-[10px] text-neutral-400 uppercase font-mono">Rating: Strong Resilience</span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
            <div className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Savings Efficiency</span>
              <Award size={15} className="text-[#F59E0B]" />
            </div>
            <div className="text-xl font-bold text-white mt-1">46.0%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Exceeds 30% guideline</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
            <div className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Emergency Runway</span>
              <Shield size={15} className="text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">11.4 Months</div>
            <div className="text-[11px] text-emerald-400 mt-1">Target: ≥ 6 Months</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
            <div className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Precious Metals Ratio</span>
              <Coins size={15} className="text-[#F59E0B]" />
            </div>
            <div className="text-xl font-bold text-white mt-1">22.0%</div>
            <div className="text-[11px] text-neutral-400 mt-1">Hedge against inflation</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
            <div className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Debt-to-Income (DTI)</span>
              <TrendingUp size={15} className="text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">19.8%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Well within safe &lt;35% limit</div>
          </div>
        </div>

        {/* Executive Observations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
            Key Algorithmic Observations & Recommendations
          </h3>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A] flex items-start gap-2.5">
              <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Consistent Monthly Inflow: </span>
                Net savings of ₹1,12,600 projected for November provides ample margin for compounding SIPs.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A] flex items-start gap-2.5">
              <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Term Life Adequacy Gap: </span>
                Indicative gap of ₹44 Lakhs detected on top of active ₹2.5 Cr cover. Review loan amortization schedules.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

