'use client';

import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { ProjectsGrid, useProjects } from '@/entities/project';

type ProjectsProps = {
  queryKey: string;
};

export function Projects({ queryKey }: ProjectsProps) {
  const { ref, inView } = useInView();

  const {
    data: projects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useProjects({ queryKey });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [projects, inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {status === 'error' ? (
        <p className="text-muted-foreground text-center">
          При загрузке проектов произошла ошибка
        </p>
      ) : (
        <Fragment>
          <ProjectsGrid
            projects={status === 'pending' ? [] : projects.pages.flat()}
            isPending={status === 'pending'}
            isFetching={isFetchingNextPage}
          />

          <span
            ref={ref}
            data-slot="intersection-observer-marker"
            className="invisible"
          />
        </Fragment>
      )}
    </div>
  );
}
