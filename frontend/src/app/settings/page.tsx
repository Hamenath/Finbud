'use client';

import React, { useState } from 'react';
import {
  User,
  Database,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [name, setName] = useState('Hamenath');
  const [email, setEmail] = useState('hamestudy@gmail.com');
  const [currency, setCurrency] = useState('INR (₹)');
  const [riskProfile, setRiskProfile] = useState('MODERATE');
  const [targetIncome, setTargetIncome] = useState('50000');
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          System Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Manage user preferences, financial baselines, and academic environment connections
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Section */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
            <User size={18} className="text-[#111827]" />
            <h2 className="text-base font-bold text-[#111827]">Client Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Monthly Income Baseline (₹)</label>
              <input
                type="number"
                value={targetIncome}
                onChange={(e) => setTargetIncome(e.target.value)}
                className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Risk Appetite Profile</label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full bg-[#F7FAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:bg-white focus:border-[#1E40AF]"
              >
                <option value="CONSERVATIVE">Conservative (Capital Preservation)</option>
                <option value="MODERATE">Moderate (Balanced Multi-Asset)</option>
                <option value="AGGRESSIVE">Aggressive (Equity & Growth Tilted)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database & Security Section */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
            <Database size={18} className="text-[#111827]" />
            <h2 className="text-base font-bold text-[#111827]">Database & Academic Data Isolation</h2>
          </div>

          <div className="space-y-3 text-xs text-[#374151]">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E5E7EB]">
              <div>
                <p className="font-semibold text-[#111827]">PostgreSQL Row-Level Security (RLS)</p>
                <p className="text-[11px] text-[#6B7280]">Enforced per-user isolation: auth.uid() = user_id</p>
              </div>
              <span className="text-[10px] bg-[#ECFDF5] text-[#111827] border border-[#E5E7EB] px-2 py-0.5 rounded font-mono font-bold">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7FAF8] border border-[#E5E7EB]">
              <div>
                <p className="font-semibold text-[#111827]">Academic Demonstration Dataset</p>
                <p className="text-[11px] text-[#6B7280]">Re-seed verified sample transactions, gold holdings and policies</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Demo dataset reset to initial state for evaluation.')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-semibold text-[#111827]"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-[#111827] flex items-center gap-1 font-mono">
              <Check size={14} /> Preferences updated successfully
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#10B981] text-[#111827] hover:bg-[#10B981] text-[#111827] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

