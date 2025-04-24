import { ProjectService } from '@/entities/project/api/project-service';

export type ProjectForReview = Awaited<
  ReturnType<typeof ProjectService.getProjectsForReview>
>[number];
