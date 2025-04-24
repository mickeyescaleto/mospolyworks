import { Skeleton } from '@repo/ui/core/skeleton';

export function NavigationPanelActionsSkeleton() {
  return (
    <div className="size-10 p-1">
      <Skeleton className="size-full rounded-full" />
    </div>
  );
}
