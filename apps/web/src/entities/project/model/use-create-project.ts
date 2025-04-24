'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProjectService } from '@/entities/project/api/project-service';
import { ROUTES } from '@/shared/constants/routes';

export function useCreateProject() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      const promise = ProjectService.createProject();

      toast.promise(promise, {
        loading: 'Подождите, проект создаётся...',
        success: 'Проект успешно создан!',
        error: 'Ошибка при создании проекта',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (data) => {
      router.push(`${ROUTES.PROJECTS}/${data.id}/edit`);
    },
  });
}
