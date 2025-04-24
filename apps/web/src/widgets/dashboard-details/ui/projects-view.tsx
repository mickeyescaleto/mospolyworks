'use client';

import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { ProjectCardSkeletons } from '@/widgets/dashboard-details/ui/project-card-skeletons';
import { ProjectCard } from '@/widgets/dashboard-details/ui/project-card';
import { useProjectsForReview } from '@/entities/project';

export function ProjectsView() {
  const { ref, inView } = useInView();

  const {
    data: projects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useProjectsForReview();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [projects, inView, hasNextPage, fetchNextPage]);

  return (
    <div className="grid w-full auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isPending ? (
        <ProjectCardSkeletons />
      ) : isError ? (
        <p className="text-destructive col-span-full text-center">
          При загрузке проектов произошла ошибка!
        </p>
      ) : projects.pages.flat().length > 0 ? (
        <Fragment>
          {projects.pages.flat().map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {isFetchingNextPage && <ProjectCardSkeletons />}

          <span
            ref={ref}
            data-slot="intersection-observer-marker"
            className="invisible"
          />
        </Fragment>
      ) : (
        <p className="text-muted-foreground col-span-full text-center">
          Проекты отсутствуют
        </p>
      )}
    </div>
  );
}
