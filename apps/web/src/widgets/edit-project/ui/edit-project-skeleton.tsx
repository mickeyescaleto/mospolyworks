import { Skeleton } from '@repo/ui/core/skeleton';

import { Wrapper } from '@/shared/ui/wrapper';

export function EditProjectSkeleton() {
  return (
    <Wrapper>
      <div className="mb-4 flex justify-between gap-2">
        <div className="flex gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>

        <div>
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
      </div>

      <div>
        <Skeleton className="aspect-video rounded-lg md:aspect-[16/7]" />

        <div className="lg:px-28">
          <div className="my-5">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-240 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
