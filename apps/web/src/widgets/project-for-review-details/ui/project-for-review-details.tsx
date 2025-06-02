'use client';

import { ProjectCover, useProjectForReview } from '@/entities/project';
import { EditorOutputBlock, type OutputData } from '@/features/editor';

type ProjectForReviewDetailsProps = {
  projectId: string;
};

export function ProjectForReviewDetails({
  projectId,
}: ProjectForReviewDetailsProps) {
  const { data: project, isError, isPending } = useProjectForReview(projectId);

  if (isPending) {
    return <p className="text-muted-foreground text-center">Загрузка...</p>;
  }

  if (isError) {
    return <p className="text-destructive text-center">Произошла ошибка!</p>;
  }

  return (
    <div>
      <ProjectCover cover={project.cover} />

      <div className="lg:px-28">
        <h1 className="header header-h1 header-h1-margin mt-4 text-center lg:mt-5">
          {project.title}
        </h1>

        <EditorOutputBlock data={{ blocks: project.content } as OutputData} />
      </div>
    </div>
  );
}
