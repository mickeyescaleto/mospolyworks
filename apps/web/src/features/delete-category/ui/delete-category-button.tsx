'use client';

import { Trash2Icon } from '@repo/ui/core/icons';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import { type Category, useDeleteCategory } from '@/entities/category';

type DeleteCategoryButtonProps = {
  category: Category;
};

export function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
  const { mutate: deleteCategory } = useDeleteCategory();

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon-sm">
                <Trash2Icon className="size-4" />

                <span className="sr-only">Удалить</span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Вы уверены, что хотите удалить категорию?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Это действие невозможно отменить. Это приведет к полному
                удалению категории, всех{' '}
                <span className="underline">проектов</span> и{' '}
                <span className="underline">тегов</span> с этой категорией.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Отменить</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteCategory(category.id)}
                className={buttonVariants({ variant: 'destructive' })}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <TooltipContent side="bottom">
            <p>Удалить</p>
          </TooltipContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  );
}
