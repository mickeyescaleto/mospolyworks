'use client';

import { redirect } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { useUser } = useAuth();
  const { data: user } = useUser();

  if (user) {
    redirect('/');
  }

  return children;
}
