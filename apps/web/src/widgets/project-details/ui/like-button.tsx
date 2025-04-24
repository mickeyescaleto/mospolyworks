'use client';

import { Fragment } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { HeartIcon, Loader2Icon } from '@repo/ui/core/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';
import { Button } from '@repo/ui/core/button';

import { KEYS, useProjectLike } from '@/entities/project';
import { useCreateLike, useDeleteLike } from '@/entities/like';

type LikeButtonProps = {
  projectId: string;
};

export function LikeButton({ projectId }: LikeButtonProps) {
  const { data, isPending } = useProjectLike(projectId);
  const { mutate: createLike } = useCreateLike();
  const { mutate: deleteLike } = useDeleteLike();

  const like = data?.at(0) || null;

  const queryClient = useQueryClient();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (like) {
                deleteLike(like.id, {
                  onSuccess: () => {
                    queryClient.refetchQueries({
                      queryKey: [KEYS.PROJECT_LIKE, projectId],
                    });
                  },
                });
              } else {
                createLike(projectId, {
                  onSuccess: () => {
                    queryClient.refetchQueries({
                      queryKey: [KEYS.PROJECT_LIKE, projectId],
                    });
                  },
                });
              }
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Fragment>
                <Loader2Icon className="size-4 animate-spin" />

                <span className="sr-only">Загрузка...</span>
              </Fragment>
            ) : like ? (
              <Fragment>
                <HeartIcon className="fill-foreground hover:fill-accent-foreground size-4" />

                <span className="sr-only">Убрать лайк</span>
              </Fragment>
            ) : (
              <Fragment>
                <HeartIcon className="size-4" />

                <span className="sr-only">Поставить лайк</span>
              </Fragment>
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          {isPending ? (
            <p>Загрузка...</p>
          ) : like ? (
            <p>Убрать лайк</p>
          ) : (
            <p>Поставить лайк</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
