'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { PROJECTS_FETCH_LIMIT } from '@/entities/project/constants/fetch';
import { ProjectService } from '@/entities/project/api/project-service';
import { type GetExhibitionProjectsQuery } from '@/entities/project/types/get-exhibition-projects';

type useExhibitionProjectsProps = {
  queryKey: string;
  query: Omit<GetExhibitionProjectsQuery, 'cursor' | 'limit'>;
};

export function useExhibitionProjects({
  queryKey,
  query,
}: useExhibitionProjectsProps) {
  return useInfiniteQuery({
    queryKey: [KEYS.EXHIBITION_PROJECTS, queryKey, query],
    queryFn: ({ pageParam }) =>
      ProjectService.getExhibitionProjects({
        cursor: pageParam,
        limit: PROJECTS_FETCH_LIMIT,
        ...query,
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
