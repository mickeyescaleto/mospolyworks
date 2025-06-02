'use client';

import { ProjectContributors } from '@/widgets/project-details/ui/project-contributors';
import { ProjectActions } from '@/widgets/project-details/ui/project-actions';
import { LazyEditorBlock, type OutputData } from '@/features/editor';
import { type ExhibitionProject, ProjectCover } from '@/entities/project';

type ProjectDetailsProps = {
  project: ExhibitionProject;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-y-2">
        <ProjectContributors project={project} />

        <ProjectActions project={project} />
      </div>

      <ProjectCover cover={project.cover} />

      <div className="lg:px-28">
        <h1 className="header header-h1 header-h1-margin mt-4 text-center lg:mt-5">
          {project.title}
        </h1>

        <LazyEditorBlock
          holder="editor"
          data={{ blocks: project.content } as OutputData}
          onChange={(data) => console.log(data)}
          readOnly
        />
      </div>
    </div>
  );
}
