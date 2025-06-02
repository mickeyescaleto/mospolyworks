import { ReactNode } from 'react';

import { AdminGuard } from '@/entities/account';

export default async function ProjectsForReviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
