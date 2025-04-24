import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/ui/utilities/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full text-xs font-normal w-fit whitespace-nowrap shrink-0 [&_svg:not([class*="size-"])]:size-4 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        glassy: 'backdrop-blur text-white bg-zinc-950/60',
      },
      size: {
        default: 'px-2 py-1',
        lg: 'px-3 py-2',
        xl: 'px-4 py-3 text-sm',
        icon: 'p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
