import { ReactNode } from 'react';
import { type Metadata } from 'next';

import { cn } from '@repo/ui/utilities/cn';

import { inter } from '@/root/styles/fonts';
import { Providers } from '@/root/providers';

import '@/root/styles/main.css';

export const metadata: Metadata = {
  title: {
    default: 'mospolyworks',
    template: `mospolyworks – %s`,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background text-foreground flex min-h-dvh flex-col font-sans',
          inter.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
