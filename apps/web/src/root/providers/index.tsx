import { ReactNode } from 'react';

import { Toaster } from '@repo/ui/core/sonner';

import { QueryProvider } from '@/root/providers/query-provider';
import { ThemeProvider } from '@/root/providers/theme-provider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}
