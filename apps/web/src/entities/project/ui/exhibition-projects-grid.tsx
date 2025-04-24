import { Fragment, ComponentProps } from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { AlertCircleIcon, HeartIcon } from '@repo/ui/core/icons';

import { getLikesWord } from '@/entities/project/utilities/get-likes-word';
import { ProjectCard } from '@/entities/project/ui/project-card';
import { ProjectCardBadge } from '@/entities/project/ui/project-card-badge';
import { ProjectCardSkeletons } from '@/entities/project/ui/project-card-skeletons';
import { type ExhibitionProject } from '@/entities/project/types/exhibition-project';
import { ROUTES } from '@/shared/constants/routes';
import { formatNumberWithK } from '@/shared/utilities/format-number-with-k';

type ExhibitionProjectsGridProps = {
  projects: Pick<
    ExhibitionProject,
    'id' | 'title' | 'cover' | 'status' | 'author' | 'partners' | '_count'
  >[];
  isPending?: boolean;
  isFetching?: boolean;
} & ComponentProps<'div'>;

export function ExhibitionProjectsGrid({
  projects,
  isPending = false,
  isFetching = false,
  className,
  ...props
}: ExhibitionProjectsGridProps) {
  return (
    <div className="w-full">
      <div
        className={cn(
          'grid w-full auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
          className,
        )}
        {...props}
      >
        {isPending ? (
          <ProjectCardSkeletons />
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center">
            Нет доступных проектов
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              href={`${ROUTES.PROJECTS}/${project.id}`}
              overlay={
                <Fragment>
                  {project.status !== 'verified' && (
                    <ProjectCardBadge
                      badge={<AlertCircleIcon className="size-4" />}
                      tooltip={{
                        content: <p>Проект не проверен</p>,
                        side: 'bottom',
                      }}
                      className="absolute top-2 right-2 p-1"
                    />
                  )}

                  <ProjectCardBadge
                    badge={
                      <Fragment>
                        <HeartIcon className="size-3.5" />

                        <span className="text-xs">
                          {formatNumberWithK(project._count.likes)}
                        </span>
                      </Fragment>
                    }
                    tooltip={{
                      content: <p>{getLikesWord(project._count.likes)}</p>,
                      side: 'top',
                    }}
                    className="absolute right-2 bottom-2"
                  />
                </Fragment>
              }
              {...project}
            />
          ))
        )}

        {isFetching && <ProjectCardSkeletons />}
      </div>
    </div>
  );
}
