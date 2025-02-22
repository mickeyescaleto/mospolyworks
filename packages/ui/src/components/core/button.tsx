import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/ui/utilities/cn';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-base font-medium whitespace-nowrap transition-[color,box-shadow] outline-none select-none disabled:pointer-events-none disabled:opacity-50 sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-zinc-800 text-white hover:bg-zinc-800/90 dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90',
        ghost:
          'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
