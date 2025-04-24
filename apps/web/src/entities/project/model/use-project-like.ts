'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { ProjectService } from '@/entities/project/api/project-service';

export function useProjectLike(projectId: string) {
  return useQuery({
    queryKey: [KEYS.PROJECT_LIKE, projectId],
    queryFn: () => ProjectService.getProjectLike(projectId),
  });
}
