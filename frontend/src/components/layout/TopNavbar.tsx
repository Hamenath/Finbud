'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  PlusCircle,
  LogIn,
  LogOut,
} from 'lucide-react';
import { DEMO_MARKET_TICKERS } from '@/data/demoData';
import { createClient } from '@/utils/supabase/client';

interface TopNavbarProps {
  onMenuClick: () => void;
  onOpenQuickAdd: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/transactions': 'Transactions Ledger',
  '/analytics': 'Predictive Analytics',
  '/wealth-lab': 'Wealth Multiplier Lab',
  '/gold-silver': 'Gold & Silver Vault',
  '/insurance-shield': 'Smart Insurance Shield',
  '/reports': 'Financial Reports',
  '/settings': 'Platform Settings',
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onOpenQuickAdd }) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
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

  const currentTitle = ROUTE_TITLES[pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      {/* 1. Subtle Market Ticker Bar */}
      <div className="bg-[#F8FAF9] border-b border-[#E5E7EB]/70 px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-medium text-[#4B5563]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[#4B5563] font-mono">
              Market Watch
            </span>
          </div>

          {DEMO_MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#6B7280]">{ticker.symbol}</span>
              <span className="text-[#1F2937] font-semibold">{ticker.price}</span>
              <span
                className={`text-[10px] font-semibold ${
                  ticker.isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#6B7280] ml-4 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>NSE / RBI Interbank Delayed Reference</span>
        </div>
      </div>

      {/* 2. Main Horizontal Navigation Bar */}
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider hidden sm:inline">
              FINBUD
            </span>
            <span className="text-[#D1D5DB] hidden sm:inline">/</span>
            <h1 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight">
              {currentTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#10B981] text-white hover:bg-[#059669] shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Entry</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#111827] leading-tight">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-[#6B7280]">Verified Account</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#111827] text-white hover:bg-black transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
