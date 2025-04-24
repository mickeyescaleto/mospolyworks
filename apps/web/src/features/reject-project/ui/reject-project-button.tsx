'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

import { rejectProjectSchema } from '@/features/reject-project/schemas/reject-project';
import { type ProjectForReview, useRejectProject } from '@/entities/project';
import { Label } from '@repo/ui/core/label';
import { Input } from '@repo/ui/core/input';

type FormValues = z.infer<typeof rejectProjectSchema>;

type RejectProjectButtonProps = {
  project: ProjectForReview;
};

export function RejectProjectButton({ project }: RejectProjectButtonProps) {
  const { mutate: rejectProject, isPending } = useRejectProject();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(rejectProjectSchema),
  });

  async function onSubmit(data: FormValues) {
    rejectProject({ id: project.id, body: data });
    reset();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Отклонить</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отклонение проекта</AlertDialogTitle>
          <AlertDialogDescription>
            Для отклонения проекта необходимо указать причину и подтвердить
            действие.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rejectionComment" className="sr-only">
              Причина
            </Label>

            <Input
              id="rejectionComment"
              placeholder="Введите комментарий"
              type="text"
              {...register('rejectionComment')}
            />

            {errors?.rejectionComment && (
              <p className="text-destructive px-2 text-xs">
                {errors.rejectionComment.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => reset()}>
              Отменить
            </AlertDialogCancel>

            <AlertDialogAction
              type="submit"
              disabled={isPending || !isValid}
              className={buttonVariants({ variant: 'destructive' })}
            >
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
