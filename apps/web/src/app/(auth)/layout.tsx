import { ReactNode } from 'react';

import { AccountGuard } from '@/entities/account';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AccountGuard mode="guest-only">
      <main className="flex flex-1 flex-col">{children}</main>
    </AccountGuard>
  );
}
