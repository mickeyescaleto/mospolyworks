import { Skeleton } from '@repo/ui/core/skeleton';

export function NotificationMenuSkeleton() {
  return (
    <div className="size-10 p-1.5">
      <Skeleton className="size-full rounded-full" />
    </div>
  );
}
