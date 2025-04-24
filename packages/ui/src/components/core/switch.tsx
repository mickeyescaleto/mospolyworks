'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@repo/ui/utilities/cn';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-border focus-visible:ring-ring/5 inline-flex h-5 w-8 shrink-0 items-center rounded-full transition-all outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-0.125rem)] data-[state=unchecked]:translate-x-[0.125rem]',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
