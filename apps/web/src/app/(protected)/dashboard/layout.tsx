import { ReactNode } from 'react';
import { type Metadata } from 'next';

import { AdminGuard } from '@/entities/account';

export const metadata: Metadata = {
  title: 'панель управления',
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
