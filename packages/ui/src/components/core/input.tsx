import * as React from 'react';

import { cn } from '@repo/ui/utilities/cn';

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base font-medium text-zinc-900 outline-hidden transition-colors focus:ring-2 focus:ring-black/5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5',
        className,
      )}
      {...props}
    />
  );
}
