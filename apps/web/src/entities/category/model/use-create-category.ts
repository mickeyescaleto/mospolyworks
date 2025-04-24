'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/category/constants/keys';
import { CategoryService } from '@/entities/category/api/category-service';
import { type Category } from '@/entities/category/types/category';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Parameters<typeof CategoryService.createCategory>[0],
    ) => {
      const promise = CategoryService.createCategory(data);

      toast.promise(promise, {
        loading: 'Подождите, проверяем данные...',
        success: (data) => `Категория ${data.label} создана`,
        error: 'Произошла ошибка! Категория не создана',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Category[]>([KEYS.CATEGORIES], (old = []) => [
        data,
        ...old,
      ]);

      queryClient.invalidateQueries({ queryKey: [KEYS.CATEGORIES] });
    },
  });
}
