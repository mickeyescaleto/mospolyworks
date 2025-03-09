'use client';

import { useProject } from '@/hooks/use-project';
import { ProjectCard } from '@/components/project-card';
import { ProjectCardSkeleton } from '@/components/project-card-skeleton';
import type { GetExhibitionProjectsQuery } from '@/types/project';

type ProjectsSectionProps = {
  query: GetExhibitionProjectsQuery;
};

export function ProjectsSection({ query }: ProjectsSectionProps) {
  const { useExhibitionProjectsQuery } = useProject();
  const {
    data: exhibitionProjects,
    isPending,
    isError,
  } = useExhibitionProjectsQuery(query);

  return (
    <section className="pt-6 pb-12">
      <div className="wrapper">
        {isPending ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <ProjectCardSkeleton key={idx} />
              ))}
          </div>
        ) : isError ? (
          <p className="text-center">При загрузке проектов произошла ошибка</p>
        ) : exhibitionProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {exhibitionProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center">Проекты не найдены</p>
        )}
      </div>
    </section>
  );
}
