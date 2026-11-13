'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  TrendingUp,
  Coins,
  ShieldCheck,
  Bot,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Wealth Lab', href: '/wealth-lab', icon: TrendingUp },
  { name: 'Gold & Silver', href: '/gold-silver', icon: Coins },
  { name: 'Insurance Shield', href: '/insurance-shield', icon: ShieldCheck },
  { name: 'FINBUD AI', href: '/finbud-ai', icon: Bot, isAi: true },
  { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0A0A0C] border-r border-[#1F1F26] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-[#1F1F26]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20">
              F
            </div>
            {!collapsed && (
              <div>
                <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  FINBUD
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AI
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-medium">Wealth Intelligence</p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1A1A22] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#10B981] text-black font-semibold shadow-lg shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Icon
                  size={20}
                  className={`${
                    isActive
                      ? 'text-black'
                      : item.isAi
                      ? 'text-[#F59E0B] group-hover:scale-110 transition-transform'
                      : 'text-neutral-400 group-hover:text-white'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    {item.name}
                    {item.isAi && !isActive && (
                      <span className="text-[10px] bg-amber-500/20 text-[#F59E0B] border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
                        RAG
                      </span>
                    )}
                  </span>
                )}
                {/* Active Indicator Bar */}
                {isActive && collapsed && (
                  <div className="absolute right-0 top-2 bottom-2 w-1 bg-black rounded-l" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Banner & Utilities */}
        <div className="p-3 border-t border-[#1F1F26] space-y-3">
          {!collapsed && (
            <div className="p-3.5 rounded-2xl bg-linear-to-b from-[#1C1C24] to-[#121217] border border-[#2E2E3A] relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-[#F59E0B]" />
                <span className="text-xs font-semibold text-white">Academic Edition</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                FINBUD Machine Learning & Financial Decision Support
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-mono font-medium">CSD Final Year</span>
                <span className="text-neutral-400">Team ABG</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-2 text-xs text-neutral-400">
            <Link
              href="/settings"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <HelpCircle size={16} />
              {!collapsed && <span>Help & Docs</span>}
            </Link>
            <button
              onClick={() => alert('Demo Session Reset: Data cleared for academic presentation.')}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
              title="Reset Demo"
            >
              <LogOut size={16} />
              {!collapsed && <span>Reset</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

