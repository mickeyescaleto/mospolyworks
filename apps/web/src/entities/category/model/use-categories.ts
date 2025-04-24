'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/category/constants/keys';
import { CategoryService } from '@/entities/category/api/category-service';

export function useCategories() {
  return useQuery({
    queryKey: [KEYS.CATEGORIES],
    queryFn: () => CategoryService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}
