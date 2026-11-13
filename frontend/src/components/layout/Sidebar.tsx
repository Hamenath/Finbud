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
import { FinbudLogo } from '@/components/common/FinbudLogo';

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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out shadow-xs ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header with Official SVG Logo */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-[#E5E7EB]">
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
            className="hidden lg:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
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
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#10B981] text-white font-semibold shadow-sm'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}
              >
                <Icon
                  size={19}
                  className={`${
                    isActive
                      ? 'text-white'
                      : item.isAi
                      ? 'text-[#10B981] group-hover:scale-110 transition-transform'
                      : 'text-[#6B7280] group-hover:text-[#111827]'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    {item.name}
                    {item.isAi && !isActive && (
                      <span className="text-[10px] bg-[#ECFDF5] text-[#087F5B] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono font-semibold">
                        RAG
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Banner & Utilities */}
        <div className="p-3 border-t border-[#E5E7EB] space-y-3 bg-[#FAFAF9]">
          {!collapsed && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-[#10B981]" />
                <span className="text-xs font-semibold text-[#111827]">Academic Edition</span>
              </div>
              <p className="text-[11px] text-[#6B7280] mb-2 leading-relaxed">
                FINBUD Machine Learning & Financial Decision Support
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#087F5B] font-mono font-semibold">CSD Final Year</span>
                <span className="text-[#6B7280]">Team ABG</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-2 text-xs text-[#6B7280]">
            <Link
              href="/settings"
              className="flex items-center gap-2 hover:text-[#111827] transition-colors"
            >
              <HelpCircle size={15} />
              {!collapsed && <span>Help & Docs</span>}
            </Link>
            <button
              onClick={() => alert('Demo Session Reset: Cache cleared for academic presentation.')}
              className="flex items-center gap-1.5 hover:text-[#DC2626] transition-colors"
              title="Reset Demo"
            >
              <LogOut size={15} />
              {!collapsed && <span>Reset</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
