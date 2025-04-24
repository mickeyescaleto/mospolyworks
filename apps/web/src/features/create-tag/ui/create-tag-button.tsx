'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

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

import { createTagSchema } from '@/features/create-tag/schemas/create-tag';
import { KEYS, type Category } from '@/entities/category';
import { useCreateTag, useTags } from '@/entities/tag';
import { Input } from '@repo/ui/core/input';
import { Label } from '@repo/ui/core/label';

type FormValues = z.infer<typeof createTagSchema>;

type CreateTagButtonProps = {
  category: Category;
};

export function CreateTagButton({ category }: CreateTagButtonProps) {
  const { data: tags, isPending: isTagsPending } = useTags({
    categoryId: category.id,
  });
  const { mutate: createTag, isPending: isCreateTagPending } = useCreateTag();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      categoryId: category.id,
    },
  });

  const handleReset = () => reset({ categoryId: category.id, label: '' });

  async function onSubmit(data: FormValues) {
    if (isTagsPending) {
      return toast.error('Дождитесь загрузки тегов');
    }

    if (tags?.some((tag) => tag.label === data.label)) {
      handleReset();
      return toast.error('Тег уже существует!');
    }

    createTag(data, {
      onSuccess: (data) => {
        queryClient.setQueryData<Category[]>([KEYS.CATEGORIES], (old = []) =>
          old.map((category) =>
            category.id === data.category.id
              ? {
                  ...category,
                  _count: {
                    ...category._count,
                    tags: category._count.tags + 1,
                  },
                }
              : category,
          ),
        );
      },
    });
    handleReset();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={isTagsPending}>
          Создать
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Создание нового тега</AlertDialogTitle>
          <AlertDialogDescription>
            Для создания нового тега необходимо указать название и подтвердить
            действие.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="label" className="sr-only">
              Название тега
            </Label>

            <Input
              id="label"
              placeholder="Введите название"
              type="text"
              disabled={isCreateTagPending}
              {...register('label')}
            />

            {errors?.label && (
              <p className="text-destructive px-2 text-xs">
                {errors.label.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => handleReset()}>
              Отменить
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isTagsPending || isCreateTagPending || !isValid}
            >
              Создать
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
