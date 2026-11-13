'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  PlusCircle,
  LogIn,
  LogOut,
  Radio,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { DEMO_MARKET_TICKERS } from '@/data/demoData';
import { useMarketTicks } from '@/hooks/useMarketTicks';
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
  const { ticks, isConnected, connectionState } = useMarketTicks();
  const [isClientMarketOpen, setIsClientMarketOpen] = useState<boolean>(false);

  // Prefer live WebSocket streaming ticks if connected and available, else fallback to baseline
  const activeTickers = ticks && ticks.length > 0 ? ticks : DEMO_MARKET_TICKERS;

  // Check client-side IST time inside useEffect to comply with Next.js prerender rules
  useEffect(() => {
    const checkMarketWindow = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const istMinutes = (utcHours * 60 + utcMinutes + 330) % 1440;
      setIsClientMarketOpen(istMinutes >= 9 * 60 && istMinutes < 19 * 60);
    };
    checkMarketWindow();
    const interval = setInterval(checkMarketWindow, 30000); // Re-check every 30s
    return () => clearInterval(interval);
  }, []);

  const hasLiveTicker = Boolean(activeTickers.find((t: any) => t.status === 'LIVE'));
  const isMarketWindowOpen = hasLiveTicker || isClientMarketOpen;

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
      <div className="bg-[#F8FAF9] border-b border-[#E5E7EB]/70 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Connection & Trading Status Indicator */}
          <div className="flex items-center gap-1.5 font-medium text-[#4B5563]">
            {isMarketWindowOpen && connectionState === 'CONNECTED' ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            ) : (
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionState === 'RECONNECTING' || connectionState === 'CONNECTING'
                    ? 'bg-[#F59E0B] animate-ping'
                    : 'bg-[#9CA3AF]'
                }`}
              />
            )}
            <span
              className={`text-[10px] uppercase tracking-wider font-mono font-bold flex items-center gap-1 ${
                isMarketWindowOpen && connectionState === 'CONNECTED'
                  ? 'text-red-600'
                  : 'text-[#6B7280]'
              }`}
            >
              {isMarketWindowOpen && connectionState === 'CONNECTED'
                ? 'LIVE'
                : connectionState === 'RECONNECTING'
                ? 'RECONNECTING...'
                : 'OFFLINE'}
            </span>
          </div>

          {activeTickers.map((ticker: any) => {
            const isUp = ticker.tick_direction === 'UP';
            const isDown = ticker.tick_direction === 'DOWN';
            const status = ticker.status || (isMarketWindowOpen ? 'LIVE' : 'OFFLINE');
            const isOffline = status === 'OFFLINE' || !isMarketWindowOpen;
            const isNav = status === 'DAILY_NAV';

            return (
              <div
                key={ticker.symbol}
                className={`flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded transition-colors duration-300 border ${
                  isOffline
                    ? 'border-[#E5E7EB]/60 bg-white/70'
                    : isUp
                    ? 'border-[#A7F3D0]/60 bg-[#ECFDF5]/80'
                    : isDown
                    ? 'border-[#FECACA]/60 bg-[#FEF2F2]/80'
                    : 'border-transparent'
                }`}
                title={`${ticker.name} | Upstream: ${ticker.provider || 'Yahoo Finance'} | Delay: ${ticker.delay_status || 'DELAY_UNVERIFIED'} | Upstream Time: ${ticker.provider_timestamp || 'N/A'} | Status: ${isOffline ? 'OFFLINE (Market Closed)' : status}${ticker.official_amfi_nav ? ` | ${ticker.official_amfi_nav}` : ''}${ticker.statutory_assumptions ? ` | ${ticker.statutory_assumptions}` : ''}`}
              >
                <span className="text-[#6B7280] font-medium">{ticker.symbol}</span>
                <span
                  className={`font-semibold transition-colors duration-200 ${
                    isOffline
                      ? 'text-[#4B5563]'
                      : isUp
                      ? 'text-[#059669]'
                      : isDown
                      ? 'text-[#DC2626]'
                      : 'text-[#1F2937]'
                  }`}
                >
                  {ticker.price}
                </span>

                {/* Status Badge */}
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase font-bold tracking-tight ${
                    isOffline
                      ? 'bg-[#F3F4F6] text-[#6B7280]'
                      : isNav
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'bg-[#ECFDF5] text-[#059669]'
                  }`}
                >
                  {isOffline ? 'OFFLINE' : isNav ? 'DAILY NAV' : 'LIVE'}
                </span>

                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    ticker.isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'
                  }`}
                >
                  {isUp && !isOffline && <TrendingUp className="w-2.5 h-2.5 inline" />}
                  {isDown && !isOffline && <TrendingDown className="w-2.5 h-2.5 inline" />}
                  {ticker.change}
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#6B7280] ml-4 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>Yahoo Finance Aggregator (Delayed/Unverified) | AMFI Official Daily NAV</span>
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
