import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/utils/cn';
import './globals.css';

const inter = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Quick 2-Hour Demo',
  description: 'AlignUI on Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn(inter.variable, 'h-full antialiased')}
    >
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}