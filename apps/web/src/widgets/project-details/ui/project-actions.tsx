'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  BookDashedIcon,
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  InfoIcon,
  PenIcon,
  Trash2Icon,
} from '@repo/ui/core/icons';
import { Button, buttonVariants } from '@repo/ui/core/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/core/dropdown-menu';
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

import { LikeButton } from '@/widgets/project-details/ui/like-button';
import { useAccount } from '@/entities/account';
import {
  type ExhibitionProject,
  useUnpublishProject,
  useDeleteProject,
} from '@/entities/project';
import { TagButton } from '@/entities/tag';
import { CreateReport } from '@/features/create-report';

type ProjectActionsProps = {
  project: ExhibitionProject;
};

export function ProjectActions({ project }: ProjectActionsProps) {
  const { data: account } = useAccount();
  const { mutate: unpublishProject } = useUnpublishProject(project.id);
  const { mutate: deleteProject } = useDeleteProject(project.id);

  const router = useRouter();

  return (
    <div className="space-x-2">
      <LikeButton projectId={project.id} />

      {project.link && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild>
                <Link href={project.link} target="_blank">
                  <ExternalLinkIcon className="size-4" />

                  <span className="sr-only">Перейти на сайт</span>
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p>Перейти на сайт</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <Dialog>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <InfoIcon className="size-4" />

                  <span className="sr-only">Просмотр информации</span>
                </Button>
              </TooltipTrigger>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Информация о проекте</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {project.publishedAt && (
                  <p className="text-center sm:text-left">
                    Опубликован:{' '}
                    <span className="text-muted-foreground">
                      {format(project.publishedAt, "d MMMM, yyyy 'в' HH:mm", {
                        locale: ru,
                      })}
                    </span>
                  </p>
                )}

                <div className="flex justify-center gap-4 sm:justify-start">
                  <div className="bg-accent text-accent-foreground w-32 space-y-1 rounded-md p-3 text-center">
                    <p className="text-sm">Просмотры</p>

                    <p className="text-lg">{project.views}</p>
                  </div>

                  <div className="bg-accent text-accent-foreground w-32 space-y-1 rounded-md p-3 text-center">
                    <p className="text-sm">Лайки</p>

                    <p className="text-lg">{project._count.likes}</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {project.category && (
                    <Button
                      type="button"
                      variant="default"
                      size="xs"
                      className="rounded-sm"
                      asChild
                    >
                      <Link href={`/categories/${project.category.id}`}>
                        {project.category.label}
                      </Link>
                    </Button>
                  )}

                  {project.tags.map((tag) => (
                    <TagButton key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            </DialogContent>

            <TooltipContent side="bottom">
              <p>Посмотреть информацию</p>
            </TooltipContent>
          </Dialog>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVerticalIcon className="size-4" />

                  <span className="sr-only">Действия</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>

            <DropdownMenuContent className="w-44" align="end">
              {project.author.id === account?.id ? (
                <Fragment>
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/${project.id}/edit`}>
                      <PenIcon className="size-4" />

                      <span>Редактировать</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(event) => event.preventDefault()}
                      >
                        <BookDashedIcon className="size-4" />

                        <span>В черновики</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

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
                              onSuccess: () => {
                                router.replace(`/projects/${project.id}/edit`);
                              },
                            })
                          }
                        >
                          Подтвердить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(event) => event.preventDefault()}
                      >
                        <Trash2Icon className="size-4" />

                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Вы уверены, что хотите удалить проект?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          Это действие невозможно отменить. Это приведет к
                          полному удалению проекта.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Отменить</AlertDialogCancel>

                        <AlertDialogAction
                          className={buttonVariants({ variant: 'destructive' })}
                          onClick={() =>
                            deleteProject(undefined, {
                              onSuccess: () => {
                                router.replace('/');
                              },
                            })
                          }
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Fragment>
              ) : (
                <CreateReport projectId={project.id} />
              )}
            </DropdownMenuContent>

            <TooltipContent side="bottom">
              <p>Действия</p>
            </TooltipContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
