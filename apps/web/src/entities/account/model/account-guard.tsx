'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { useAccount } from '@/entities/account/model/use-account';
import { ROUTES } from '@/shared/constants/routes';
import { LoadingScreen } from '@/shared/ui/loading-screen';

type AccountGuardProps = {
  mode: 'guest-only' | 'protected';
  children: ReactNode;
};

export function AccountGuard({ mode, children }: AccountGuardProps) {
  const { data: account, isPending } = useAccount();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (account && mode === 'guest-only') {
    redirect(ROUTES.MAIN);
  }

  if (!account && mode === 'protected') {
    redirect(ROUTES.LOGIN);
  }

  return children;
}
