'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/category/constants/keys';
import { CategoryService } from '@/entities/category/api/category-service';

export function useCategoriesForProject() {
  return useQuery({
    queryKey: [KEYS.CATEGORIES_FOR_PROJECT],
    queryFn: () => CategoryService.getCategoriesForProject(),
  });
}
