'use client';

import React from 'react';
import {
  Download,
  Printer,
  CheckCircle,
  Award,
  TrendingUp,
  Shield,
  Coins,
} from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Financial Health Scorecard & Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Comprehensive audit-ready monthly performance summary and PDF scorecard generator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-all shadow-xs"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert('PDF Scorecard Export initiated: FINBUD_November_2026_Report.pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Sheet (Light Theme) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E5E7EB] gap-4">
          <div>
            <div className="text-[11px] font-mono text-[#065F46] font-bold tracking-widest uppercase bg-[#ECFDF5] px-2.5 py-1 rounded-md inline-block border border-[#A7F3D0]">
              ACADEMIC PROTOTYPE FINANCIAL AUDIT
            </div>
            <h2 className="text-xl font-bold text-[#111827] mt-2">Monthly Financial Health Report</h2>
            <p className="text-xs text-[#6B7280]">Statement Period: 01 Nov 2026 – 30 Nov 2026</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#6B7280]">FINBUD Health Index</span>
            <div className="text-3xl font-black text-[#10B981] font-mono">88 / 100</div>
            <span className="text-[10px] text-[#6B7280] uppercase font-mono">Rating: Strong Resilience</span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] flex items-center justify-between">
              <span>Savings Efficiency</span>
              <Award size={15} className="text-[#10B981]" />
            </div>
            <div className="text-xl font-bold text-[#111827] mt-1">46.0%</div>
            <div className="text-[11px] text-[#059669] mt-1">Exceeds 30% guideline</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] flex items-center justify-between">
              <span>Emergency Runway</span>
              <Shield size={15} className="text-[#10B981]" />
            </div>
            <div className="text-xl font-bold text-[#111827] mt-1">11.4 Months</div>
            <div className="text-[11px] text-[#059669] mt-1">Target: ≥ 6 Months</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] flex items-center justify-between">
              <span>Precious Metals Ratio</span>
              <Coins size={15} className="text-[#D97706]" />
            </div>
            <div className="text-xl font-bold text-[#111827] mt-1">22.0%</div>
            <div className="text-[11px] text-[#6B7280] mt-1">Hedge against inflation</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div className="text-xs text-[#6B7280] flex items-center justify-between">
              <span>Debt-to-Income (DTI)</span>
              <TrendingUp size={15} className="text-[#2563EB]" />
            </div>
            <div className="text-xl font-bold text-[#111827] mt-1">19.8%</div>
            <div className="text-[11px] text-[#059669] mt-1">Well within safe &lt;35% limit</div>
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono uppercase text-[#6B7280] tracking-wider">
            Key Algorithmic Observations & Recommendations
          </h3>

          <div className="space-y-2 text-xs text-[#374151]">
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-2.5">
              <CheckCircle size={15} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#111827]">Consistent Monthly Inflow: </span>
                Net savings of ₹1,12,600 projected for November provides ample margin for compounding SIPs.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-2.5">
              <CheckCircle size={15} className="text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#111827]">Term Life Adequacy Gap: </span>
                Indicative gap of ₹44 Lakhs detected on top of active ₹2.5 Cr cover. Review loan liabilities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
