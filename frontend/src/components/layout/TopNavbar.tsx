'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  PlusCircle,
  LogIn,
  LogOut,
  ChevronRight,
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
  '/finbud-ai': 'FINBUD AI Assistant',
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-pulse" />
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
                  ticker.isPositive ? 'text-[#1E40AF]' : 'text-[#DC2626]'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 pl-4 text-[10px] text-[#6B7280] font-mono">
          <span>NSE / IBJA 15M REF</span>
        </div>
      </div>

      {/* 2. Main Minimal Navbar */}
      <div className="px-6 h-16 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Mobile Menu & Clean Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B7280]">FINBUD</span>
            <ChevronRight size={13} className="text-[#9CA3AF]" />
            <span className="font-semibold text-[#1F2937] text-sm tracking-tight">{currentTitle}</span>
          </div>
        </div>

        {/* Right: Quick Action & User Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-[#1E40AF] text-white font-medium text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">Add Entry</span>
          </button>

          {/* User Profile Capsule */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E7EB]">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-xs font-bold text-[#1E3A8A]">
                {user.user_metadata?.full_name
                  ? user.user_metadata.full_name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-[#1F2937] hidden md:inline truncate max-w-32">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2]/40 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] transition-all"
              >
                <LogIn size={13} className="text-[#1E40AF]" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

