import { ComponentProps } from 'react';

import { cn } from '@repo/ui/utilities/cn';

type HeadingProps = ComponentProps<'h1'>;

export function Heading({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        'text-3xl leading-snug font-bold tracking-tight break-words lg:text-4xl',
        className,
      )}
      {...props}
    />
  );
}
