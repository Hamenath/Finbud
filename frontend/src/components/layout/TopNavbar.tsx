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
  Sparkles,
} from 'lucide-react';
import { DEMO_MARKET_TICKERS } from '@/data/demoData';
import { createClient } from '@/utils/supabase/client';
import { FinbudLogo } from '../common/FinbudLogo';
import { StaggeredMenu } from '../ui/StaggeredMenu';

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

const STAGGERED_NAV_ITEMS = [
  { label: 'Overview', ariaLabel: 'Go to Overview dashboard', link: '/' },
  { label: 'Transactions', ariaLabel: 'View Transactions Ledger', link: '/transactions' },
  { label: 'Analytics', ariaLabel: 'Predictive Analytics & Anomaly Detection', link: '/analytics' },
  { label: 'Wealth Lab', ariaLabel: 'Wealth Multiplier Lab', link: '/wealth-lab' },
  { label: 'Gold & Silver', ariaLabel: 'Precious Metals Vault', link: '/gold-silver' },
  { label: 'Insurance', ariaLabel: 'Smart Insurance Shield', link: '/insurance-shield' },
  { label: 'Reports', ariaLabel: 'Financial Scorecard Reports', link: '/reports' },
  { label: 'Settings', ariaLabel: 'Platform Configuration', link: '/settings' },
];

const STAGGERED_SOCIAL_ITEMS = [
  { label: 'NSE India', link: 'https://www.nseindia.com' },
  { label: 'RBI Spot', link: 'https://rbi.org.in' },
  { label: 'SEBI Portal', link: 'https://sebi.gov.in' },
];

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
    <header className="sticky top-0 z-30 bg-[#FFFDF5] border-b-[1.5px] border-[#182B46]">
      {/* 1. Playful Geometric Market Watch Bar */}
      <div className="bg-[#E9FFF5] border-b-[1.5px] border-[#182B46] px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-bold text-[#182B46]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD05B] border-[1.5px] border-[#182B46] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-mono">
              Live Rates
            </span>
          </div>

          {DEMO_MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
              <span className="text-[#4B5E76]">{ticker.symbol}</span>
              <span className="text-[#182B46]">{ticker.price}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border border-[#182B46] ${
                  ticker.isPositive ? 'bg-[#FFD05B] text-[#182B46]' : 'bg-[#EF4444]/20 text-[#DC2626]'
                }`}
              >
                {ticker.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-[#182B46] ml-4 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#182B46]" />
          <span>NSE / RBI Benchmark</span>
        </div>
      </div>

      {/* 2. Main Horizontal Navigation Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg border-[1.5px] border-[#182B46] bg-[#FFD05B] shadow-[2px_2px_0_#182B46] text-[#182B46] hover:bg-[#E5B842] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-[#4B5E76] uppercase tracking-wider hidden sm:inline">
              FINBUD
            </span>
            <span className="text-[#182B46] font-bold hidden sm:inline">/</span>
            <h1 className="text-base sm:text-lg font-extrabold text-[#182B46] tracking-tight">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Quick Action, StaggeredMenu, & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="neo-btn-yellow flex items-center gap-1.5 px-3.5 py-1.5 text-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Entry</span>
          </button>

          {/* React Bits StaggeredMenu Trigger */}
          <div className="relative">
            <StaggeredMenu
              position="right"
              items={STAGGERED_NAV_ITEMS}
              socialItems={STAGGERED_SOCIAL_ITEMS}
              displaySocials={true}
              displayItemNumbering={true}
              colors={['#FFD05B', '#9DE8CB']}
              logoUrl="/brand/finbud-logo.svg"
              menuButtonColor="#182B46"
              openMenuButtonColor="#182B46"
              accentColor="#FFD05B"
              changeMenuColorOnOpen={true}
              isFixed={true}
              closeOnClickAway={true}
            />
          </div>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l-[1.5px] border-[#182B46]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#182B46] leading-tight">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] font-bold text-[#4B5E76]">Verified Account</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border-[1.5px] border-[#182B46] bg-white shadow-[2px_2px_0_#182B46] text-[#182B46] hover:bg-[#FFFDF5] transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="neo-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs"
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
