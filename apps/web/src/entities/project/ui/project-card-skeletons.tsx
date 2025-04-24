import { PROJECTS_FETCH_LIMIT } from '@/entities/project/constants/fetch';
import { ProjectCardSkeleton } from '@/entities/project/ui/project-card-skeleton';

export function ProjectCardSkeletons() {
  return Array(PROJECTS_FETCH_LIMIT)
    .fill(0)
    .map((_, idx) => <ProjectCardSkeleton key={idx} />);
}
