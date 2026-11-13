'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { DEMO_INSURANCE_POLICIES } from '@/data/demoData';

export default function InsuranceShieldPage() {
  const annualIncome = 245000 * 12;
  const recommendedTermCoverage = annualIncome * 10;
  const currentTermCoverage = 25000000;
  const coverageGap = recommendedTermCoverage - currentTermCoverage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Smart Insurance Shield
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Adequacy stress-testing, term life gap heuristics (10× annual income) and policy renewal tracking
        </p>
      </div>

      {/* Heuristic Adequacy Card (Light Theme) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                10X INCOME HEURISTIC ANALYSIS
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#111827] mt-1">Term Life Coverage Adequacy</h2>
            <p className="text-xs text-[#6B7280]">
              Based on ₹29.4L annual gross income, recommended term life cover is ~₹2.94 Crore
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#6B7280]">Current Active Sum Insured</span>
            <div className="text-2xl font-black text-[#111827] font-mono">₹2.50 Crore</div>
          </div>
        </div>

        {/* Coverage Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#374151]">
            <span>Adequacy Ratio: 85.0% Covered</span>
            <span className="text-[#D97706] font-mono font-semibold">
              Indicative Gap: ~₹44.0 Lakh
            </span>
          </div>
          <div className="w-full bg-[#F3F4F6] h-2.5 rounded-full overflow-hidden border border-[#E5E7EB]">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 pt-1">
          <HelpCircle size={13} className="text-[#10B981]" />
          <span>
            The 10× rule is a financial starting heuristic, not universal individual advice. Consider loan liabilities and dependants.
          </span>
        </div>
      </div>

      {/* Active Policies Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_INSURANCE_POLICIES.map((policy) => (
          <div
            key={policy.id}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 hover:border-[#D1D5DB] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                {policy.type === 'TERM_LIFE' ? 'PURE TERM LIFE' : 'COMPREHENSIVE HEALTH'}
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                  policy.status === 'UPCOMING_RENEWAL'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-[#F3F4F6] text-[#4B5563]'
                }`}
              >
                {policy.status === 'UPCOMING_RENEWAL' ? 'Renewal Due' : 'Active'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[#111827] text-base">{policy.provider}</h3>
              <p className="text-xs text-[#6B7280] font-mono mt-0.5">Policy #{policy.policyNo}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB] text-xs">
              <div>
                <span className="text-[#6B7280] text-[11px]">Sum Insured</span>
                <p className="font-mono font-bold text-[#111827] text-sm">
                  ₹{(policy.sumInsured / 100000).toFixed(1)} Lakh
                </p>
              </div>
              <div>
                <span className="text-[#6B7280] text-[11px]">Annual Premium</span>
                <p className="font-mono font-bold text-[#374151] text-sm">
                  ₹{policy.annualPremium.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-[#6B7280] text-[11px]">Covered Members</span>
                <p className="text-[#374151] text-[11px] truncate">{policy.members}</p>
              </div>
              <div>
                <span className="text-[#6B7280] text-[11px]">Renewal Date</span>
                <p className="text-[#D97706] font-mono font-semibold text-[11px]">
                  {policy.renewalDate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
