import { ProjectService } from '@/entities/project/api/project-service';

export type Project = Awaited<ReturnType<typeof ProjectService.getProjectById>>;
