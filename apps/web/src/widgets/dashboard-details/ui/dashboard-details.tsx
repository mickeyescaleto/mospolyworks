'use client';

import { useSearchParams } from 'next/navigation';

import { ProjectsView } from '@/widgets/dashboard-details/ui/projects-view';
import { ReportsView } from '@/widgets/dashboard-details/ui/reports-view';
import { CategoriesView } from '@/widgets/dashboard-details/ui/categories-view';
import { QUERY_PARAMS, TABS } from '@/features/dashboard-tabs';

export function DashboardDetails() {
  const searchParams = useSearchParams();

  const param = searchParams.get(QUERY_PARAMS.TAB)?.toString();

  const value = (
    param && TABS.find((tab) => tab.value === param) ? param : TABS[0].value
  ) as (typeof TABS)[number]['value'];

  switch (value) {
    case 'projects':
      return <ProjectsView />;
    case 'reports':
      return <ReportsView />;
    case 'categories':
      return <CategoriesView />;
  }
}
