'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Trash2Icon } from '@repo/ui/core/icons';
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
import { DropdownMenuItem } from '@repo/ui/core/dropdown-menu';
import { buttonVariants } from '@repo/ui/core/button';
import { Label } from '@repo/ui/core/label';
import { Input } from '@repo/ui/core/input';

import { createReportSchema } from '@/features/create-report/schemas/create-report';
import { useCreateReport } from '@/entities/report';

type FormValues = z.infer<typeof createReportSchema>;

type CreateReportProps = {
  projectId: string;
};

export function CreateReport({ projectId }: CreateReportProps) {
  const { mutate: createReport, isPending } = useCreateReport();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createReportSchema),
  });

  async function onSubmit(data: FormValues) {
    createReport({ ...data, projectId });
    reset();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(event) => event.preventDefault()}
        >
          <Trash2Icon className="size-4" />

          <span>Пожаловаться</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Вы уверены, что хотите пожаловаться?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Для продолжение необходимо заполнить поле ниже и подтвердить
            действие.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="content" className="sr-only">
              Причина жалобы
            </Label>

            <Input
              id="content"
              placeholder="Введите причину жалобы"
              type="text"
              {...register('content')}
            />

            {errors?.content && (
              <p className="text-destructive px-2 text-xs">
                {errors.content.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => reset()}>
              Отменить
            </AlertDialogCancel>

            <AlertDialogAction
              type="submit"
              className={buttonVariants({ variant: 'destructive' })}
              disabled={isPending || !isValid}
            >
              Пожаловаться
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
