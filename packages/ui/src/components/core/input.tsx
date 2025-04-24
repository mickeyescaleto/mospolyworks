import * as React from 'react';

import { cn } from '@repo/ui/utilities/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-background text-foreground flex h-10 w-full rounded-full border px-5 text-sm transition-all outline-none placeholder:opacity-50',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-ring/5 focus-visible:ring-2',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
