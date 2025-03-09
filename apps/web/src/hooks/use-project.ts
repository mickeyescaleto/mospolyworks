'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProjectService } from '@/services/project';
import type { GetExhibitionProjectsQuery } from '@/types/project';

export function useProject() {
  function useExhibitionProjectsQuery(query: GetExhibitionProjectsQuery) {
    return useQuery({
      queryKey: ['exhibition-projects', query],
      queryFn: () => ProjectService.getExhibitionProjects(query),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5,
    });
  }

  return { useExhibitionProjectsQuery };
}
