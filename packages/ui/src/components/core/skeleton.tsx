import { cn } from '@repo/ui/utilities/cn';

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-lg bg-zinc-900/10 dark:bg-white/10',
        className,
      )}
      {...props}
    />
  );
}
