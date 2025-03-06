import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/ui/utilities/cn';

export const buttonVariants = cva(
  "inline-flex items-center shrink-0 justify-center gap-2 rounded-lg text-base font-medium whitespace-nowrap transition-[color,box-shadow] outline-none select-none disabled:pointer-events-none disabled:opacity-50 sm:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-zinc-800 text-white hover:bg-zinc-800/90 dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90',
        ghost:
          'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900',
        outline:
          'border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-transparent dark:hover:border-transparent',
        header:
          'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50',
        filter:
          'border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white data-[active=true]:border-transparent dark:data-[active=true]:border-transparent data-[active=true]:bg-zinc-900 data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-zinc-900 data-[active=true]:duration-0 hover:bg-zinc-100 dark:hover:bg-zinc-800',
      },
      size: {
        sm: 'h-8 px-2 has[>svg]:px-2',
        default: 'h-9 px-3 has-[>svg]:px-3',
        icon: 'size-8',
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
