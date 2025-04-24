import { ProjectService } from '@/entities/project/api/project-service';

export type Contributor = Awaited<
  ReturnType<typeof ProjectService.getProjectById>
>['author'];
