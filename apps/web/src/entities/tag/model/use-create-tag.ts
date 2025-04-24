'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/tag/constants/keys';
import { TagService } from '@/entities/tag/api/tag-service';
import { type Tag } from '@/entities/tag/types/tag';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof TagService.createTag>[0]) => {
      const promise = TagService.createTag(data);

      toast.promise(promise, {
        loading: 'Подождите, проверяем данные...',
        success: (data) => `Тег ${data.label} создан`,
        error: 'Произошла ошибка! Тег не создан',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Tag[]>(
        [KEYS.TAGS, data.category.id],
        (old = []) => [data, ...old],
      );

      queryClient.invalidateQueries({
        queryKey: [KEYS.TAGS, data.category.id],
      });
    },
  });
}
