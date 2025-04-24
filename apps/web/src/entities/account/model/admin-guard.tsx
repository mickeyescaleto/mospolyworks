'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { useAccount } from '@/entities/account/model/use-account';
import { ROUTES } from '@/shared/constants/routes';

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: account } = useAccount();

  if (!account?.roles.includes('admin')) {
    redirect(ROUTES.MAIN);
  }

  return children;
}
