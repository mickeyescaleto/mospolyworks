'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/tag/constants/keys';
import { TagService } from '@/entities/tag/api/tag-service';

type useTagsProps = {
  categoryId: string;
  enabled?: boolean;
};

export function useTags({ categoryId, enabled = true }: useTagsProps) {
  return useQuery({
    queryKey: [KEYS.TAGS, categoryId],
    queryFn: () => TagService.getTags(categoryId),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
}
