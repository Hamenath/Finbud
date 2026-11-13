'use client';

import React from 'react';
import { Coins, ArrowUpRight, ArrowDownRight, ShieldCheck, Sparkles, Scale, History } from 'lucide-react';
import { DEMO_METALS } from '@/data/demoData';

export default function GoldSilverPage() {
  const totalGoldGrams = DEMO_METALS.filter((m) => m.metal === 'GOLD').reduce(
    (acc, m) => acc + m.weightGrams,
    0
  );
  const totalValue = DEMO_METALS.reduce((acc, m) => acc + m.currentValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gold & Silver Portfolio Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Physical jewelry, hallmarked coins, and RBI Sovereign Gold Bonds (SGB) with reference benchmark rates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono bg-[#141418] border border-[#22222D] px-3 py-1.5 rounded-xl">
            Live Reference: ₹7,742 / g (24K Gold)
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="text-xs text-neutral-400">Total Precious Metals Valuation</div>
          <div className="text-2xl font-black text-white mt-1">₹{totalValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <ArrowUpRight size={13} /> +36.8% Overall Realized & Unrealized PnL
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="text-xs text-neutral-400">Total Gold Holdings (Fine Weight)</div>
          <div className="text-2xl font-black text-[#F59E0B] mt-1">{totalGoldGrams.toFixed(1)} Grams</div>
          <div className="text-[11px] text-neutral-400 mt-1 font-mono">
            35g SGB (Tax-Free at Maturity) + 20g Physical
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141418] border border-[#22222D]">
          <div className="text-xs text-neutral-400">Silver Bullion Holdings</div>
          <div className="text-2xl font-black text-slate-300 mt-1">1.000 Kilogram</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Current Rate: ₹91,200 / kg
          </div>
        </div>
      </div>

      {/* Holdings Breakdown Table */}
      <div className="rounded-2xl bg-[#141418] border border-[#22222D] overflow-hidden">
        <div className="p-5 border-b border-[#22222D] flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Coins size={18} className="text-[#F59E0B]" />
            Verified Metal Holdings Ledger
          </h2>
          <span className="text-[11px] text-neutral-400 font-mono">DELAYS: 15-MIN IBJA REF</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0A0C] text-neutral-400 font-mono uppercase text-[10px] border-b border-[#22222D]">
              <tr>
                <th className="px-5 py-3.5">Holding Asset</th>
                <th className="px-5 py-3.5">Purity Grade</th>
                <th className="px-5 py-3.5">Weight</th>
                <th className="px-5 py-3.5 text-right">Purchase Rate</th>
                <th className="px-5 py-3.5 text-right">Current Value</th>
                <th className="px-5 py-3.5 text-right">Unrealized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F2A]">
              {DEMO_METALS.map((m) => (
                <tr key={m.id} className="hover:bg-[#191922] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{m.type}</div>
                    <div className="text-[11px] text-neutral-400">{m.metal} Asset Class</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-neutral-300">{m.purity}</td>
                  <td className="px-5 py-4 font-mono text-white font-semibold">
                    {m.weightGrams >= 1000 ? `${(m.weightGrams / 1000).toFixed(1)} kg` : `${m.weightGrams}g`}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-neutral-400">
                    ₹{m.purchaseRate.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-white">
                    ₹{m.currentValue.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight size={12} /> +{m.pnlPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

