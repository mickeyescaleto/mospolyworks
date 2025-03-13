import * as React from 'react';
import type { Metadata } from 'next';

import { cn } from '@repo/ui/utilities/cn';
import { Toaster } from '@repo/ui/core/sonner';

import { gilroy } from '@/styles/fonts';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeSwitch } from '@/components/theme-switch';

import '@/styles/main.css';

export const metadata: Metadata = {
  title: {
    default: 'mospolyworks',
    template: `mospolyworks – %s`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-dvh flex-col overflow-x-hidden bg-white font-sans font-medium text-zinc-900 antialiased dark:bg-zinc-950 dark:text-white',
          gilroy.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <ThemeSwitch />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
