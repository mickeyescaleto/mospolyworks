'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProjectService } from '@/entities/project/api/project-service';

export function useEditProject(projectId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof ProjectService.editProject>[1]) => {
      const promise = ProjectService.editProject(projectId, body);

      toast.promise(promise, {
        loading: 'Подождите, идёт сохранение проекта...',
        success: 'Проект успешно сохранён',
        error: 'Произошла ошибка! Проект не был сохранён',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
}
