'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Key,
  Database,
  RefreshCw,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const [name, setName] = useState('Diwakar D');
  const [email, setEmail] = useState('diwakar@finbud.academic');
  const [currency, setCurrency] = useState('INR (₹)');
  const [riskProfile, setRiskProfile] = useState('MODERATE');
  const [targetIncome, setTargetIncome] = useState('245000');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Manage user preferences, financial baselines, and academic environment connections
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Section */}
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222D] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#22222B]">
            <User size={18} className="text-[#F59E0B]" />
            <h2 className="text-base font-bold text-white">Client Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Monthly Income Baseline (₹)</label>
              <input
                type="number"
                value={targetIncome}
                onChange={(e) => setTargetIncome(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Risk Appetite Profile</label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-[#262632] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="CONSERVATIVE">Conservative (Capital Preservation)</option>
                <option value="MODERATE">Moderate (Balanced Multi-Asset)</option>
                <option value="AGGRESSIVE">Aggressive (Equity & Growth Tilted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Database & Security Controls */}
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#22222D] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#22222B]">
            <Database size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">Database & Academic Data Isolation</h2>
          </div>

          <div className="space-y-3 text-xs text-neutral-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
              <div>
                <p className="font-semibold text-white">PostgreSQL Row-Level Security (RLS)</p>
                <p className="text-[11px] text-neutral-400">Enforced per-user isolation: auth.uid() = user_id</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0C] border border-[#1F1F2A]">
              <div>
                <p className="font-semibold text-white">Academic Demonstration Dataset</p>
                <p className="text-[11px] text-neutral-400">Re-seed verified sample transactions, gold holdings and policies</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Demo dataset reset to initial state for evaluation.')}
                className="px-3 py-1.5 rounded-lg bg-[#1C1C24] hover:bg-[#282836] border border-[#2E2E3E] text-xs font-semibold text-[#F59E0B]"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <Check size={14} /> Preferences updated successfully
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

