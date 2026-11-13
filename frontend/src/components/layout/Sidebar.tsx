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

      {/* Main Minimalist Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#E5E7EB]">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            {collapsed ? (
              <FinbudLogo showWordmark={false} size="sm" />
            ) : (
              <FinbudLogo showWordmark={true} size="sm" />
            )}
          </Link>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono font-medium uppercase tracking-wider text-[#6B7280]">
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
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#ECFDF5] text-[#065F46] font-semibold border border-[#A7F3D0]'
                    : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'text-[#10B981]' : 'text-[#6B7280] group-hover:text-[#111827]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Security Badge */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[11px] font-semibold text-[#111827]">
                Protected Ledger
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] leading-tight">
              Supabase RLS & AES-256 Storage
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
