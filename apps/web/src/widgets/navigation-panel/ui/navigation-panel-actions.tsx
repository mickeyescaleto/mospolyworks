'use client';

import { Fragment } from 'react';

import { NavigationPanelActionsSkeleton } from '@/widgets/navigation-panel/ui/navigation-panel-actions-skeleton';
import { DashboardLink } from '@/widgets/navigation-panel/ui/dashboard-link';
import { LoginLink } from '@/widgets/navigation-panel/ui/login-link';
import { NotificationMenu } from '@/features/notification-menu';
import { AccountMenu } from '@/features/account-menu';
import { useAccount } from '@/entities/account';

export function NavigationPanelActions() {
  const { data: account, isPending } = useAccount();

  if (isPending) {
    return <NavigationPanelActionsSkeleton />;
  }

  if (!account) {
    return <LoginLink />;
  }

  return (
    <Fragment>
      <DashboardLink />

      <NotificationMenu />

      <AccountMenu account={account} />
    </Fragment>
  );
}
