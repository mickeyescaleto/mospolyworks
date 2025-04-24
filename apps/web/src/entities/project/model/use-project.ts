'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { ProjectService } from '@/entities/project/api/project-service';

export function useProject(projectId: string) {
  return useQuery({
    queryKey: [KEYS.PROJECT, projectId],
    queryFn: () => ProjectService.getProjectById(projectId),
  });
}
