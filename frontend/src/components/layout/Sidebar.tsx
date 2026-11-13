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
  FileSpreadsheet,
  Settings,
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Dark Minimalist Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0B0D14] border-r border-[#191B25] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header with Exact Reference Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#191B25]">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <FinbudLogo showWordmark={!collapsed} size="sm" />
          </Link>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          {!collapsed && (
            <div className="px-3 pb-2 text-[11px] font-mono font-medium uppercase tracking-wider text-[#71809B]">
              Navigation
            </div>
          )}

          {navigationItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#10245C] text-[#F4F6FF] border border-[#0033FF]/40'
                    : 'text-[#A9BCE0] hover:bg-[#10131D] hover:text-[#F4F6FF]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div
                  className={`p-1 rounded-md transition-colors ${
                    isActive ? 'text-[#0033FF]' : 'text-[#71809B] group-hover:text-[#A9BCE0]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>

                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Info Pill */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-[10px] bg-[#05060A] border border-[#191B25]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0033FF] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#F4F6FF]">
                Telemetry Engine
              </span>
            </div>
            <p className="text-[10px] font-normal text-[#71809B] leading-tight">
              Sub-second latency • AES-256 Encrypted
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
