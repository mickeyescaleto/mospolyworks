'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { PROJECTS_FETCH_LIMIT } from '@/entities/project/constants/fetch';
import { ProjectService } from '@/entities/project/api/project-service';

type useProjectsProps = {
  queryKey: string;
};

export function useProjects({ queryKey }: useProjectsProps) {
  return useInfiniteQuery({
    queryKey: [KEYS.PROJECTS, queryKey],
    queryFn: ({ pageParam }) =>
      ProjectService.getProjects({
        cursor: pageParam,
        limit: PROJECTS_FETCH_LIMIT,
      }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      if (!(lastPage.length === PROJECTS_FETCH_LIMIT)) {
        return undefined;
      }

      return lastPage.at(-1)?.id;
    },
  });
}
