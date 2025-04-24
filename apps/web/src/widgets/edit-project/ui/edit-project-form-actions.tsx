'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';

import { ArchiveIcon, SettingsIcon, Trash2Icon } from '@repo/ui/core/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/core/tooltip';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/core/dialog';
import { Button, buttonVariants } from '@repo/ui/core/button';
import { Input } from '@repo/ui/core/input';

import { SelectPartners } from '@/features/select-partners';
import { SelectCategory } from '@/features/select-category';
import { SelectTags } from '@/features/select-tags';
import {
  KEYS,
  usePublishProject,
  useUnpublishProject,
  useDeleteProject,
} from '@/entities/project';
import { ROUTES } from '@/shared/constants/routes';

type EditProjectFormActionsProps = {
  projectId: string;
  projectStatus:
    | 'unpublished'
    | 'published'
    | 'verified'
    | 'rejected'
    | 'corrected';
  isDirty: boolean;
  isValid: boolean;
  canPublish: boolean;
};

export const EditProjectFormActions = memo(function EditProjectFormActions({
  projectId,
  projectStatus,
  isDirty,
  isValid,
  canPublish,
}: EditProjectFormActionsProps) {
  const queryClient = useQueryClient();
  const { mutate: publishProject } = usePublishProject(projectId);
  const { mutate: unpublishProject } = useUnpublishProject(projectId);
  const { mutate: deleteProject } = useDeleteProject(projectId);

  const { register, control, watch } = useFormContext();

  const categoryId = watch('categoryId');

  const router = useRouter();

  return (
    <div className="mb-4 flex justify-between gap-2">
      <div className="flex gap-2">
        <Tooltip>
          <AlertDialog>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вы уверены, что хотите удалить проект?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Это действие невозможно отменить. Это приведет к полному
                  удалению проекта.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Отменить</AlertDialogCancel>

                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                  onClick={() =>
                    deleteProject(undefined, {
                      onSuccess: () => {
                        router.replace(ROUTES.MAIN);
                      },
                    })
                  }
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

            <TooltipContent>
              <p>Удалить проект</p>
            </TooltipContent>
          </AlertDialog>
        </Tooltip>

        {['published', 'verified'].includes(projectStatus) && (
          <Tooltip>
            <AlertDialog>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <ArchiveIcon className="size-4" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Вы уверены, что хотите поместить в черновики?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Это действие невозможно отменить. Это приведет к
                    преобразованию проекта в черновик.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() =>
                      unpublishProject(undefined, {
                        onSuccess: (data) => {
                          queryClient.setQueryData(
                            [KEYS.PROJECT, projectId],
                            data,
                          );
                        },
                      })
                    }
                  >
                    Подтвердить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>

              <TooltipContent>
                <p>В черновики</p>
              </TooltipContent>
            </AlertDialog>
          </Tooltip>
        )}

        <Tooltip>
          <Dialog>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="icon">
                  <SettingsIcon className="size-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Настройки проекта</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <p className="text-sm">Категория</p>

                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <SelectCategory categoryId={value} onChange={onChange} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm">Теги</p>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <SelectTags
                      categoryId={categoryId}
                      tags={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm">Партнёры</p>

                <Controller
                  name="partners"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <SelectPartners partners={value} onChange={onChange} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm">Ссылка на сайт</p>
                <Input
                  placeholder="Введите ссылку"
                  {...register('link')}
                  className="w-80"
                />
              </div>
            </DialogContent>

            <TooltipContent>
              <p>Настроить проект</p>
            </TooltipContent>
          </Dialog>
        </Tooltip>
      </div>

      <div>
        {['published', 'verified'].includes(projectStatus) ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="default" disabled={!isDirty}>
                Сохранить
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вы уверены, что хотите cохранить изменения?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Это действие невозможно отменить. Это приведёт к изменению
                  данных о проекте и его отправке на проверку.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Отменить</AlertDialogCancel>

                <AlertDialogAction type="submit" form="edit-project-form">
                  Подтвердить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : isDirty || !isValid || !canPublish ? (
          <Button type="submit" variant="default" disabled={!isDirty}>
            Сохранить
          </Button>
        ) : ['unpublished', 'rejected'].includes(projectStatus) ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="default">
                Опубликовать
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вы уверены, что хотите опубликовать проект?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Если вы подтвердите это действие, этот проект будет
                  опубликован и отправлен на проверку.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Отменить</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() =>
                    publishProject(undefined, {
                      onSuccess: (data) => {
                        queryClient.setQueryData(
                          [KEYS.PROJECT, projectId],
                          data,
                        );

                        if (projectStatus === 'unpublished') {
                          router.push(`${ROUTES.PROJECTS}/${projectId}`);
                        }
                      },
                    })
                  }
                >
                  Подтвердить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
});
