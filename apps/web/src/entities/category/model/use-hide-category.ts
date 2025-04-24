'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/category/constants/keys';
import { CategoryService } from '@/entities/category/api/category-service';
import { type Category } from '@/entities/category/types/category';

export function useHideCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const promise = CategoryService.hideCategory(id);

      toast.promise(promise, {
        loading: 'Подождите, скрываем категорию...',
        success: 'Категория успешно скрыта',
        error: 'Произошла ошибка! Категория не была скрыта',
      });

      return promise;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.CATEGORIES] });

      const previousCategories =
        queryClient.getQueryData<Category[]>([KEYS.CATEGORIES]) || [];

      queryClient.setQueryData<Category[]>([KEYS.CATEGORIES], (old = []) =>
        old.map((category) =>
          category.id === id ? { ...category, isHidden: true } : category,
        ),
      );

      return { previousCategories };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([KEYS.CATEGORIES], context?.previousCategories);

      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.CATEGORIES] });
    },
  });
}
