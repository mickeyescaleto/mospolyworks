'use client';

import { notFound } from 'next/navigation';

import { EditProjectSkeleton } from '@/widgets/edit-project/ui/edit-project-skeleton';
import { EditProjectForm } from '@/widgets/edit-project/ui/edit-project-form';
import { useAccount } from '@/entities/account';
import { useProject } from '@/entities/project';
import { Wrapper } from '@/shared/ui/wrapper';

type EditProjectProps = {
  projectId: string;
};

export function EditProject({ projectId }: EditProjectProps) {
  const { data: account } = useAccount();
  const { data: project, isPending } = useProject(projectId);

  if (!account) {
    notFound();
  }

  if (isPending) {
    return <EditProjectSkeleton />;
  }

  if (!project || project.author.id !== account?.id) {
    notFound();
  }

  return (
    <Wrapper>
      {project.rejectionComment && (
        <div className="mb-4 rounded-md border p-4 text-sm">
          <span className="font-medium">Комментарий:</span>{' '}
          {project.rejectionComment}
        </div>
      )}

      <EditProjectForm project={project} />
    </Wrapper>
  );
}
