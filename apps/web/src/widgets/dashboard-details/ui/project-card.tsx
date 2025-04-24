import Link from 'next/link';

import { Button } from '@repo/ui/core/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/core/dialog';

import { ApproveProjectButton } from '@/features/approve-project';
import { RejectProjectButton } from '@/features/reject-project';
import {
  type ProjectForReview,
  ProjectCardCover,
  ProjectCardTitle,
} from '@/entities/project';
import { ROUTES } from '@/shared/constants/routes';

type ProjectCardProps = {
  project: ProjectForReview;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <ProjectCardCover cover={project.cover} alt={project.title} />

          {project.title && (
            <div className="mt-2">
              <ProjectCardTitle title={project.title} />
            </div>
          )}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Проверка проекта{' '}
            <span className="text-muted-foreground">{project.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <ProjectCardCover cover={project.cover} alt={project.title} />

          {project.status === 'corrected' && project.rejectionComment && (
            <div className="rounded-md border p-4 text-sm">
              <span className="font-medium">Комментарий:</span>{' '}
              {project.rejectionComment}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button variant="secondary" asChild>
              <Link
                href={`${ROUTES.PROJECTS_FOR_REVIEW}/${project.id}`}
                target="_blank"
              >
                Перейти на страницу
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <RejectProjectButton project={project} />

              <ApproveProjectButton project={project} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
