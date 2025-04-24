'use client';

import { useMutation } from '@tanstack/react-query';

import { LikeService } from '@/entities/like/api/like-service';

export function useDeleteLike() {
  return useMutation({
    mutationFn: (id: string) => LikeService.deleteLike(id),
    onError: (error) => {
      console.error(error.message);
    },
  });
}
