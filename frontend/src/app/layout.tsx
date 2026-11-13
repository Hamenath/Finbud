import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'FINBUD • AI Personal Wealth & Predictive Market Analytics',
  description:
    'A predictive financial intelligence and decision-support system designed for accessible personal wealth management in India.',
  icons: {
    icon: '/brand/finbud-icon.svg',
    shortcut: '/brand/finbud-icon.svg',
    apple: '/brand/finbud-icon-512.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#F7FAF8] text-[#111827] antialiased selection:bg-[#10B981]/20 selection:text-[#087F5B]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
