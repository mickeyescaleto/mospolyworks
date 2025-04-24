'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/category/constants/keys';
import { CategoryService } from '@/entities/category/api/category-service';
import { type Category } from '@/entities/category/types/category';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const promise = CategoryService.deleteCategory(id);

      toast.promise(promise, {
        loading: 'Подождите, удаляем категорию...',
        success: 'Категория успешно удалена',
        error: 'Произошла ошибка! Категория не была удалена',
      });

      return promise;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.CATEGORIES] });

      const previousCategories =
        queryClient.getQueryData<Category[]>([KEYS.CATEGORIES]) || [];

      queryClient.setQueryData<Category[]>([KEYS.CATEGORIES], (old = []) =>
        old.filter((category) => category.id !== id),
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
