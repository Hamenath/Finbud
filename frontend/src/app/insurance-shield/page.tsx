'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Users,
  Calendar,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { DEMO_INSURANCE_POLICIES } from '@/data/demoData';

export default function InsuranceShieldPage() {
  const annualIncome = 245000 * 12; // ~29.4 Lakhs
  const recommendedTermCoverage = annualIncome * 10; // 10x Heuristic (~2.94 Cr)
  const currentTermCoverage = 25000000; // 2.5 Cr
  const coverageGap = recommendedTermCoverage - currentTermCoverage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Smart Insurance Shield
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Adequacy stress-testing, term life gap heuristics (10× annual income) and policy renewal tracking
        </p>
      </div>

      {/* Heuristic Adequacy Analysis Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#141418] to-[#1A1A24] border border-[#262638] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-[#F59E0B] border border-amber-500/20">
                10X INCOME HEURISTIC ANALYSIS
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Term Life Coverage Adequacy</h2>
            <p className="text-xs text-neutral-400">
              Based on ₹29.4L annual gross income, recommended term life cover is ~₹2.94 Crore
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400">Current Active Sum Insured</span>
            <div className="text-2xl font-black text-white font-mono">₹2.50 Crore</div>
          </div>
        </div>

        {/* Coverage Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>Adequacy Ratio: 85.0% Covered</span>
            <span className="text-amber-400 font-mono font-semibold">
              Indicative Gap: ~₹44.0 Lakh
            </span>
          </div>
          <div className="w-full bg-[#0A0A0C] h-2.5 rounded-full overflow-hidden border border-[#22222E]">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
          <HelpCircle size={13} className="text-[#F59E0B]" />
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
            className="p-5 rounded-2xl bg-[#141418] border border-[#22222D] space-y-4 hover:border-[#333344] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {policy.type === 'TERM_LIFE' ? 'PURE TERM LIFE' : 'COMPREHENSIVE HEALTH'}
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  policy.status === 'UPCOMING_RENEWAL'
                    ? 'bg-amber-500/20 text-[#F59E0B] border border-amber-500/30'
                    : 'text-neutral-400'
                }`}
              >
                {policy.status === 'UPCOMING_RENEWAL' ? 'Renewal Due' : 'Active'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{policy.provider}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Policy #{policy.policyNo}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1F1F2A] text-xs">
              <div>
                <span className="text-neutral-400 text-[11px]">Sum Insured</span>
                <p className="font-mono font-bold text-white text-sm">
                  ₹{(policy.sumInsured / 100000).toFixed(1)} Lakh
                </p>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px]">Annual Premium</span>
                <p className="font-mono font-bold text-neutral-200 text-sm">
                  ₹{policy.annualPremium.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px]">Covered Members</span>
                <p className="text-neutral-300 text-[11px] truncate">{policy.members}</p>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px]">Renewal Date</span>
                <p className="text-amber-400 font-mono font-semibold text-[11px]">
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

