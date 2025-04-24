'use client';

import { useMutation } from '@tanstack/react-query';

import { LikeService } from '@/entities/like/api/like-service';

export function useCreateLike() {
  return useMutation({
    mutationFn: (projectId: string) => LikeService.createLike(projectId),
    onError: (error) => {
      console.error(error.message);
    },
  });
}
