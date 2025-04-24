'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { ProjectService } from '@/entities/project/api/project-service';

export function useExhibitionProject(id: string) {
  return useQuery({
    queryKey: [KEYS.EXHIBITION_PROJECT, id],
    queryFn: () => ProjectService.getExhibitionProjectById(id),
  });
}
