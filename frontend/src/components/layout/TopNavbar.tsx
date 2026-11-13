'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Settings,
  PlusCircle,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  X,
} from 'lucide-react';
import { DEMO_MARKET_TICKERS } from '@/data/demoData';

interface TopNavbarProps {
  onMenuClick: () => void;
  onOpenQuickAdd: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onOpenQuickAdd }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#1F1F26]">
      {/* 1. Global Live/Timestamped Market Ticker Bar */}
      <div className="bg-[#121217] border-b border-[#1F1F26] px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
              Market Watch
            </span>
          </div>

          {DEMO_MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-neutral-400 font-medium">{ticker.symbol}</span>
              <span className="text-white font-semibold">{ticker.price}</span>
              <span
                className={`font-semibold flex items-center ${
                  ticker.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-4 text-[10px] text-neutral-400 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-[#1C1C24] border border-[#2A2A36]">
            DATA DELAYED 15M
          </span>
          <span>PROVIDER: NSE / IBJA</span>
        </div>
      </div>

      {/* 2. Main Navigation & Action Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#141418] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search assets, transactions, policies or AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] border border-[#22222B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
            />
          </div>
        </div>

        {/* Right Side: Action Buttons, Notifications, User Badge */}
        <div className="flex items-center gap-3">
          {/* Quick Transaction Action */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle size={15} className="stroke-[2.5]" />
            <span className="hidden md:inline">Log Transaction</span>
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#141418] border border-transparent hover:border-[#22222B] transition-colors relative"
              aria-label="View notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F59E0B]" />
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[#141418] border border-[#262632] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-[#22222B] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">System Alerts</span>
                    <span className="text-[10px] bg-amber-500/20 text-[#F59E0B] px-1.5 py-0.5 rounded font-mono">
                      2 NEW
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#1C1C24] border border-amber-500/20 flex gap-2.5">
                    <ShieldAlert size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Insurance Renewal Due</p>
                      <p className="text-[11px] text-neutral-400">
                        Care Supreme health policy renews on 24 Nov 2026.
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1C1C24] border border-[#2A2A36] flex gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Salary Inflow Verified</p>
                      <p className="text-[11px] text-neutral-400">
                        ₹2,45,000 credited from Infosys Ltd.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#1F1F26]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-neutral-700 to-emerald-600 p-[1px]">
              <div className="w-full h-full bg-[#141418] rounded-[11px] flex items-center justify-center text-xs font-bold text-white">
                DV
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">Diwakar D</div>
              <div className="text-[10px] text-neutral-400">Team Lead & Client</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

