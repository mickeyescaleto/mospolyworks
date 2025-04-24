'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProjectService } from '@/entities/project/api/project-service';

export function useDeleteProject(projectId: string) {
  return useMutation({
    mutationFn: () => {
      const promise = ProjectService.deleteProject(projectId);

      toast.promise(promise, {
        loading: 'Подождите, проект удаляется...',
        success: 'Проект успешно удалён!',
        error: 'Произошла ошибка! Проект не удалён',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
}
