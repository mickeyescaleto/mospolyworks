import { Skeleton } from '@repo/ui/core/skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-video w-full rounded-md" />
      <Skeleton className="h-3.5 w-full rounded-full" />
      <Skeleton className="h-3 w-2/3 rounded-full" />
    </div>
  );
}
