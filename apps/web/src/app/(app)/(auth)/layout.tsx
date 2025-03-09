'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { useUserQuery } = useAuth();
  const { data: user } = useUserQuery();

  if (user) {
    redirect('/');
  }

  return children;
}
