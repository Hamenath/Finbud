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
  '/': 'Analytics Overview',
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
    <header className="sticky top-0 z-30 bg-[#05060A]/90 backdrop-blur-md border-b border-[#191B25]">
      {/* 1. Neon Dark Ticker Bar */}
      <div className="bg-[#0B0D14] border-b border-[#191B25] px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#A9BCE0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0033FF] shadow-[0_0_8px_#0033FF] animate-pulse" />
            <span className="uppercase tracking-wider font-semibold text-[#F4F6FF]">
              Live Markets
            </span>
          </div>

          {DEMO_MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#71809B]">{ticker.symbol}</span>
              <span className="text-[#F4F6FF] font-semibold">{ticker.price}</span>
              <span
                className={`text-[10px] font-semibold ${
                  ticker.isPositive ? 'text-[#0033FF]' : 'text-[#EF4444]'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#71809B] ml-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#202431]" />
          <span>NSE / RBI Benchmark</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="px-5 py-3 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg border border-[#191B25] bg-[#0B0D14] text-[#A9BCE0] hover:text-white transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#71809B] uppercase tracking-wider hidden sm:inline">
              FINBUD
            </span>
            <span className="text-[#191B25] hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-semibold text-[#F4F6FF] tracking-tight">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Quick Action & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="btn-electric flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Entry</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#191B25]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#F4F6FF] leading-tight">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-[#71809B]">Connected</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-[#191B25] bg-[#0B0D14] text-[#A9BCE0] hover:text-white hover:bg-[#10131D] transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn-charcoal flex items-center gap-1.5 text-xs"
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
