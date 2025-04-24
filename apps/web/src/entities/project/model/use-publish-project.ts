'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProjectService } from '@/entities/project/api/project-service';

export function usePublishProject(id: string) {
  return useMutation({
    mutationFn: () => {
      const promise = ProjectService.publishProject(id);

      toast.promise(promise, {
        loading: 'Подождите, проект проверяется...',
        success: 'Проект успешно опубликован',
        error: 'Произошла ошибка! Проект не опубликован',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
}
