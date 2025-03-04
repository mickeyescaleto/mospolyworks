'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: Infinity,
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

  const forcedLogout = (error: Error) => {
    if ('status' in error && error.status === 401) {
      queryClient.setQueryData(['profile'], null);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
