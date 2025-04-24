import { ReactNode } from 'react';

import { NavigationPanel } from '@/widgets/navigation-panel';

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <NavigationPanel />
      {children}
    </main>
  );
}
