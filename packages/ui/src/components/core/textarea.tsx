import * as React from 'react';

import { cn } from '@repo/ui/utilities/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'focus-visible:ring-ring/5 flex field-sizing-content min-h-20 w-full resize-none rounded-md border bg-transparent px-4 py-3 text-sm transition-all outline-none placeholder:opacity-50 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
