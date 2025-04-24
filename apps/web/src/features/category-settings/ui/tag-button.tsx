'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import { XIcon } from '@repo/ui/core/icons';
import { Badge } from '@repo/ui/core/badge';
import { Button, buttonVariants } from '@repo/ui/core/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/core/alert-dialog';

import { type Category, KEYS } from '@/entities/category';
import { useDeleteTag, type Tag } from '@/entities/tag';
import { ROUTES } from '@/shared/constants/routes';

type TagButtonProps = {
  tag: Tag;
};

export function TagButton({ tag }: TagButtonProps) {
  const { mutateAsync: deleteTag } = useDeleteTag(tag.category.id);

  const queryClient = useQueryClient();

  async function handleDelete() {
    const data = await deleteTag(tag.id);

    if (data) {
      queryClient.setQueryData<Category[]>([KEYS.CATEGORIES], (old = []) =>
        old.map((category) =>
          category.id === tag.category.id
            ? {
                ...category,
                _count: {
                  ...category._count,
                  tags: category._count.tags - 1,
                },
              }
            : category,
        ),
      );
    }
  }

  return (
    <Badge variant="secondary" size="xl" className="relative w-full">
      <Link
        href={`${ROUTES.TAGS}/${tag.id}`}
        target="_blank"
        className="hover:underline"
      >
        {tag.label}
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="void"
            size="icon-sm"
            className="hover:bg-muted/50 absolute top-1/2 right-1 -translate-y-1/2 opacity-75 hover:opacity-100"
          >
            <XIcon className="size-4" />

            <span className="sr-only">Удалить тег</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Вы уверены, что хотите удалить тег?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие невозможно отменить. Это приведет к полному удалению
              тега.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Отменить</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              className={buttonVariants({ variant: 'destructive' })}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Badge>
  );
}
