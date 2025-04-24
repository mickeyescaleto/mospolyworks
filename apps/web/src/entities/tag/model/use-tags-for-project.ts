'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/tag/constants/keys';
import { TagService } from '@/entities/tag/api/tag-service';

export function useTagsForProject(categoryId: string, enabled: boolean) {
  return useQuery({
    queryKey: [KEYS.TAGS_FOR_PROJECT, categoryId],
    queryFn: () => TagService.getTagsForProject(categoryId),
    enabled,
  });
}
