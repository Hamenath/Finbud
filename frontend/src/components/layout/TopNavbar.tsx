'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  X,
  LogIn,
  LogOut,
  TrendingUp,
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      {/* 1. Global Market Ticker Bar (Light Theme) */}
      <div className="bg-[#F8FAF9] border-b border-[#E5E7EB] px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-semibold text-[#4B5563]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider text-[#4B5563] font-mono">
              Market Watch
            </span>
          </div>

          {DEMO_MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-[#6B7280] font-medium">{ticker.symbol}</span>
              <span className="text-[#111827] font-semibold">{ticker.price}</span>
              <span
                className={`font-semibold flex items-center ${
                  ticker.isPositive ? 'text-[#059669]' : 'text-[#DC2626]'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-4 text-[10px] text-[#6B7280] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB]">
            DELAY: 15M
          </span>
          <span>NSE / IBJA REF</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />
            <input
              type="text"
              placeholder="Search assets, transactions, policies or AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
            />
          </div>
        </div>

        {/* Right Side: Log Transaction, User Capsule */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <PlusCircle size={15} className="stroke-[2.5]" />
            <span className="hidden md:inline">Log Transaction</span>
          </button>

          {/* User Profile Capsule or Sign In */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-xs font-bold text-[#087F5B]">
                  {user.user_metadata?.full_name
                    ? user.user_metadata.full_name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-[#111827] leading-tight">
                    {user.user_metadata?.full_name || 'Finbud Member'}
                  </div>
                  <div className="text-[10px] text-[#059669] font-mono">Connected</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-all"
              >
                <LogIn size={14} className="text-[#10B981]" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
