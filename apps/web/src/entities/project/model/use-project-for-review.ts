'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/project/constants/keys';
import { ProjectService } from '@/entities/project/api/project-service';

export function useProjectForReview(projectId: string) {
  return useQuery({
    queryKey: [KEYS.PROJECT_FOR_REVIEW, projectId],
    queryFn: () => ProjectService.getProjectForReviewById(projectId),
  });
}
