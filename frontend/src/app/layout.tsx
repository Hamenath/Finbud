import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'FINBUD • AI Personal Wealth & Predictive Market Analytics',
  description:
    'A predictive financial intelligence and decision-support system designed for accessible personal wealth management in India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0C] text-[#F8FAFC] antialiased selection:bg-amber-500/20 selection:text-amber-300">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
