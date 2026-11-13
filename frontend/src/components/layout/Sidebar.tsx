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
  ChevronLeft,
  ChevronRight,
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
          className="fixed inset-0 z-40 bg-[#182B46]/30 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Neo-Brutalist Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#FFFDF5] border-r-[1.5px] border-[#182B46] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b-[1.5px] border-[#182B46] bg-white">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            {collapsed ? (
              <FinbudLogo showWordmark={false} size="sm" />
            ) : (
              <FinbudLogo showWordmark={true} size="sm" />
            )}
          </Link>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#4B5E76]">
              Workspace
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
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-[#FFD05B] text-[#182B46] border-[1.5px] border-[#182B46] shadow-[3px_3px_0_#182B46] translate-y-[-1px]'
                    : 'text-[#182B46] hover:bg-white hover:border-[1.5px] hover:border-[#182B46] hover:shadow-[2px_2px_0_#9DE8CB]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div
                  className={`p-1.5 rounded-lg transition-transform ${
                    isActive
                      ? 'bg-white border-[1.5px] border-[#182B46]'
                      : 'group-hover:scale-105'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 stroke-[2.2] ${
                      isActive ? 'text-[#182B46]' : 'text-[#4B5E76] group-hover:text-[#182B46]'
                    }`}
                  />
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
          <div className="p-3 m-3 rounded-[12px] bg-[#E9FFF5] border-[1.5px] border-[#182B46] shadow-[2px_2px_0_#182B46]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#182B46]" />
              <span className="text-[11px] font-extrabold text-[#182B46]">
                Security Active
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#4B5E76] leading-tight">
              Supabase RLS & AES-256 Protected
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
