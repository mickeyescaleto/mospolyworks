'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/tag/constants/keys';
import { TagService } from '@/entities/tag/api/tag-service';
import { type Tag } from '@/entities/tag/types/tag';

export function useDeleteTag(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const promise = TagService.deleteTag(id);

      toast.promise(promise, {
        loading: 'Подождите, удаляем тег...',
        success: 'Тег успешно удален',
        error: 'Произошла ошибка! Тег не был удален',
      });

      return promise;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.TAGS, categoryId] });

      const previousTags =
        queryClient.getQueryData<Tag[]>([KEYS.TAGS, categoryId]) || [];

      queryClient.setQueryData<Tag[]>([KEYS.TAGS, categoryId], (old = []) =>
        old.filter((tag) => tag.id !== id),
      );

      return { previousTags };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([KEYS.TAGS, categoryId], context?.previousTags);

      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [KEYS.TAGS, categoryId],
      });
    },
  });
}
