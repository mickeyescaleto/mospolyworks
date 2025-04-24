import { ProjectService } from '@/entities/project/api/project-service';

export type ExhibitionProject = Awaited<
  ReturnType<typeof ProjectService.getExhibitionProjectById>
>;
