import { ReactNode } from 'react';

import { NavigationPanel } from '@/widgets/navigation-panel';
import { AccountGuard } from '@/entities/account';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AccountGuard mode="protected">
      <main className="flex flex-1 flex-col">
        <NavigationPanel />
        {children}
      </main>
    </AccountGuard>
  );
}
