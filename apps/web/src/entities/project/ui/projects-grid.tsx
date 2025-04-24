import { ComponentProps } from 'react';

import { cn } from '@repo/ui/utilities/cn';

import { ProjectCard } from '@/entities/project/ui/project-card';
import { ProjectCardSkeletons } from '@/entities/project/ui/project-card-skeletons';
import { type Project } from '@/entities/project/types/project';
import { ROUTES } from '@/shared/constants/routes';

type ProjectsGridProps = {
  projects: Pick<
    Project,
    'id' | 'title' | 'cover' | 'status' | 'author' | 'partners'
  >[];
  isPending?: boolean;
  isFetching?: boolean;
} & ComponentProps<'div'>;

export function ProjectsGrid({
  projects,
  isPending = false,
  isFetching = false,
  className,
  ...props
}: ProjectsGridProps) {
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
            Нет доступных черновиков
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              href={`${ROUTES.PROJECTS}/${project.id}/edit`}
              {...project}
            />
          ))
        )}

        {isFetching && <ProjectCardSkeletons />}
      </div>
    </div>
  );
}
