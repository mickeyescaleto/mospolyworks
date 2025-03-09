import { Skeleton } from '@repo/ui/core/skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="space-y-2 self-start">
      <Skeleton className="aspect-[2/3] size-full" />
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-3 w-2/3 rounded-full" />
    </div>
  );
}
