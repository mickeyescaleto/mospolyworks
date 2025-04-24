'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProjectService } from '@/entities/project/api/project-service';

export function useUnpublishProject(id: string) {
  return useMutation({
    mutationFn: () => {
      const promise = ProjectService.unpublishProject(id);

      toast.promise(promise, {
        loading: 'Подождите, проект проверяется...',
        success: 'Публикация проекта отменена',
        error: 'Произошла ошибка! Публикация проекта не отменена',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
}
