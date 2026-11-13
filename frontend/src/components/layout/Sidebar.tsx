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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FinbudLogo } from '@/components/common/FinbudLogo';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const navigationItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Wealth Multiplier Lab', href: '/wealth-lab', icon: TrendingUp },
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
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-[#E5E7EB]/80">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            {collapsed ? (
              <FinbudLogo showWordmark={false} size="md" />
            ) : (
              <FinbudLogo showWordmark={true} size="md" />
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1E40AF] text-white font-semibold shadow-xs'
                    : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F9FAFB]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.isAi
                      ? 'text-[#1E40AF]'
                      : 'text-[#6B7280] group-hover:text-[#1F2937]'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between truncate tracking-tight">
                    {item.name}
                    {item.isAi && !isActive && (
                      <span className="text-[10px] bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] px-1.5 py-0.5 rounded font-mono font-medium">
                        RAG
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Minimal Footer Info */}
        <div className="p-4 border-t border-[#E5E7EB]/80">
          {!collapsed ? (
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF]" />
                <span>v2.4 Light</span>
              </span>
              <span className="font-mono text-[#1E3A8A]">Academic CSD</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2 h-2 rounded-full bg-[#1E40AF]" title="Active" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

