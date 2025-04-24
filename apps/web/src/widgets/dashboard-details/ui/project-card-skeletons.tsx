import { ProjectCardSkeleton } from '@/widgets/dashboard-details/ui/project-card-skeleton';
import { PROJECTS_FETCH_LIMIT } from '@/entities/project';

export function ProjectCardSkeletons() {
  return Array(PROJECTS_FETCH_LIMIT)
    .fill(0)
    .map((_, idx) => <ProjectCardSkeleton key={idx} />);
}
