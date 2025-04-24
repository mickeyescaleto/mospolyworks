import { ComponentProps } from 'react';

import { cn } from '@repo/ui/utilities/cn';

type WrapperProps = ComponentProps<'div'>;

export function Wrapper({ children, className, ...props }: WrapperProps) {
  return (
    <div
      className={cn('container mx-auto px-4 pt-6 pb-12', className)}
      {...props}
    >
      {children}
    </div>
  );
}
