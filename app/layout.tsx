import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/utils/cn';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Mediflow — Attorney Portal',
    template: '%s · Mediflow',
  },
  description: 'A modern medical-legal portal for personal injury attorneys.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, 'h-full antialiased')} suppressHydrationWarning>
      <body className="min-h-full bg-bg-white-0 text-text-strong-950 font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary-base focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-text-white-0"
        >
          Skip to content
        </a>
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}