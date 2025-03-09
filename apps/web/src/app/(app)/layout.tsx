'use client';

import { useAuth } from '@/hooks/use-auth';
import { LoadingScreen } from '@/components/loading-screen';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { useUserQuery } = useAuth();
  const { isPending } = useUserQuery();

  if (isPending) {
    return <LoadingScreen />;
  }

  return children;
}
