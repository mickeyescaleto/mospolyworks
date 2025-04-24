'use client';

import { Fragment } from 'react';

import { EyeClosedIcon, EyeIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
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

import {
  useHideCategory,
  useShowCategory,
  type Category,
} from '@/entities/category';

type ChangeVisibilityCategoryButtonProps = {
  category: Category;
};

export function ChangeVisibilityCategoryButton({
  category,
}: ChangeVisibilityCategoryButtonProps) {
  const { mutate: hideCategory } = useHideCategory();
  const { mutate: showCategory } = useShowCategory();

  function changeVisibility() {
    if (category.isHidden) {
      showCategory(category.id);
    } else {
      hideCategory(category.id);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon-sm">
                {category.isHidden ? (
                  <EyeClosedIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}

                <span className="sr-only">
                  {category.isHidden ? (
                    <p>Показать категорию</p>
                  ) : (
                    <p>Скрыть категорию</p>
                  )}
                </span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Вы уверены, что хотите{' '}
                {category.isHidden ? (
                  <Fragment>показать</Fragment>
                ) : (
                  <Fragment>скрыть</Fragment>
                )}{' '}
                категорию?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {category.isHidden ? (
                  <Fragment>
                    Это приведёт к тому, что категория станет видна на главной
                    странице и при выборе категории для проекта.
                  </Fragment>
                ) : (
                  <Fragment>
                    Это приведёт к тому, что категория будет скрыта на главной
                    странице и при выборе категории для проекта.
                  </Fragment>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Отменить</AlertDialogCancel>
              <AlertDialogAction onClick={() => changeVisibility()}>
                {category.isHidden ? (
                  <Fragment>Показать</Fragment>
                ) : (
                  <Fragment>Скрыть</Fragment>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <TooltipContent side="bottom">
            {category.isHidden ? <p>Показать</p> : <p>Скрыть</p>}
          </TooltipContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  );
}
