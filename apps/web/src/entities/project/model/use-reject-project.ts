'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/project/constants/keys';
import { ProjectService } from '@/entities/project/api/project-service';
import { type ProjectForReview } from '@/entities/project/types/project-for-review';

export function useRejectProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof ProjectService.rejectProject>[1];
    }) => {
      const promise = ProjectService.rejectProject(id, body);

      toast.promise(promise, {
        loading: 'Подождите, проект проверяется...',
        success: 'Проект успешно отклонён',
        error: 'Произошла ошибка! Проект не отклонён',
      });

      return promise;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.PROJECTS_FOR_REVIEW] });

      const previousProjects = queryClient.getQueryData<
        InfiniteData<ProjectForReview[]>
      >([KEYS.PROJECTS_FOR_REVIEW]);

      queryClient.setQueryData<InfiniteData<ProjectForReview[]>>(
        [KEYS.PROJECTS_FOR_REVIEW],
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((project) => project.id !== id),
            ),
          };
        },
      );

      return { previousProjects };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [KEYS.PROJECTS_FOR_REVIEW],
        context?.previousProjects,
      );

      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.PROJECTS_FOR_REVIEW] });
    },
  });
}
