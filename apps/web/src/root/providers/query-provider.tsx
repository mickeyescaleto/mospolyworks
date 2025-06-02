'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { KEYS } from '@/entities/account';

export function QueryProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry(failureCount, error) {
            if ('status' in error && error.status === 401) {
              return false;
            }

            return failureCount < 2;
          },
          throwOnError(error) {
            forcedLogout(error);
            return false;
          },
        },
        mutations: {
          throwOnError(error) {
            forcedLogout(error);
            return false;
          },
        },
      },
    }),
  );

  function forcedLogout(error: Error) {
    if ('status' in error && error.status === 401) {
      queryClient.setQueryData([KEYS.ACCOUNT], null);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
