'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Settings,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import { DEMO_MARKET_TICKERS } from '@/data/demoData';
import { createClient } from '@/utils/supabase/client';

interface TopNavbarProps {
  onMenuClick: () => void;
  onOpenQuickAdd: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onOpenQuickAdd }) => {
  const router = useRouter();
  const supabase = createClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#1F1F26]">
      {/* 1. Global Market Ticker Bar */}
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

      {/* 2. Main Navigation Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side */}
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
              className="w-full bg-[#141418] border border-[#22222B] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#F59E0B]"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Quick Action */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black font-semibold text-xs shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle size={15} className="stroke-[2.5]" />
            <span className="hidden md:inline">Log Transaction</span>
          </button>

          {/* User Capsule or Sign-In Button */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#1F1F26]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-600 via-neutral-700 to-emerald-600 p-px">
                  <div className="w-full h-full bg-[#141418] rounded-[11px] flex items-center justify-center text-xs font-bold text-white">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.user_metadata?.full_name || 'Finbud Member'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Connected</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-[#141418] transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-[#1F1F26]">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141418] hover:bg-[#1E1E28] border border-[#262636] text-xs font-semibold text-white transition-all"
              >
                <LogIn size={14} className="text-[#F59E0B]" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
