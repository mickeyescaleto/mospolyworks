'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { PROJECTS_FETCH_LIMIT } from '@/entities/project/constants/fetch';
import { ProjectService } from '@/entities/project/api/project-service';

export function useProjectsForReview() {
  return useInfiniteQuery({
    queryKey: [KEYS.PROJECTS_FOR_REVIEW],
    queryFn: ({ pageParam }) =>
      ProjectService.getProjectsForReview({
        cursor: pageParam,
        limit: PROJECTS_FETCH_LIMIT,
      }),
    staleTime: 1000 * 60 * 10,
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (!(lastPage.length === PROJECTS_FETCH_LIMIT)) {
        return undefined;
      }

      return lastPage.at(-1)?.id;
    },
  });
}
