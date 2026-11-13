import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
    <html lang="en" className={`light ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#FFFDF5] text-[#182B46] antialiased selection:bg-[#FFD05B] selection:text-[#182B46]">
        <SmoothScrollProvider>
          <AppShell>{children}</AppShell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
