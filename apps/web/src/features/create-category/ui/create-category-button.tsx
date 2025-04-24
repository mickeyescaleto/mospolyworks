'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { PlusIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import { Label } from '@repo/ui/core/label';
import { Input } from '@repo/ui/core/input';
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

import { createCategorySchema } from '@/features/create-category/schemas/create-category';
import { useCategories, useCreateCategory } from '@/entities/category';

type FormValues = z.infer<typeof createCategorySchema>;

export function CreateCategoryButton() {
  const { data: categories, isPending: isCategoriesPending } = useCategories();
  const { mutate: createCategory, isPending: isCreateCategoryPending } =
    useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createCategorySchema),
  });

  async function onSubmit(data: FormValues) {
    if (isCategoriesPending) {
      return toast.error('Дождитесь загрузки категорий');
    }

    if (categories?.some((category) => category.label === data.label)) {
      reset();
      return toast.error('Категория уже существует!');
    }

    createCategory(data);
    reset();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-36 rounded-md"
                disabled={isCategoriesPending}
              >
                <PlusIcon className="size-6" />

                <span className="sr-only">Создать категорию</span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Создание новой категории</AlertDialogTitle>
              <AlertDialogDescription>
                Для создания новой категории необходимо указать{' '}
                <span className="underline">уникальное</span> название и
                подтвердить действие.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="label" className="sr-only">
                  Название категории
                </Label>

                <Input
                  id="label"
                  placeholder="Введите название"
                  type="text"
                  disabled={isCreateCategoryPending}
                  {...register('label')}
                />

                {errors?.label && (
                  <p className="text-destructive px-2 text-xs">
                    {errors.label.message}
                  </p>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={() => reset()}>
                  Отменить
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={
                    isCategoriesPending || isCreateCategoryPending || !isValid
                  }
                >
                  Создать
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>

          <TooltipContent side="bottom">
            <p>Создать категорию</p>
          </TooltipContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  );
}
