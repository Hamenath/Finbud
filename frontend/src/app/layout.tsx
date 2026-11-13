import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FINBUD • Dark Minimalist Analytics Dashboard',
  description:
    'A high-performance dark minimalist personal wealth intelligence platform with neon blue real-time telemetry.',
  icons: {
    icon: '/brand/finbud-logo-ref.png',
    shortcut: '/brand/finbud-logo-ref.png',
    apple: '/brand/finbud-logo-ref.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#05060A] text-[#F4F6FF] antialiased selection:bg-[#0033FF]/30 selection:text-[#F4F6FF]">
        <SmoothScrollProvider>
          <AppShell>{children}</AppShell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
