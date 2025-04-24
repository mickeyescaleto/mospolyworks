'use client';

import { ComponentProps } from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { Button } from '@repo/ui/core/button';

type CategoryButtonProps = {
  isSelected: boolean;
} & ComponentProps<'button'>;

export function CategoryButton({
  isSelected,
  className,
  ...props
}: CategoryButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-active={isSelected}
      className={cn(
        'data-[active=true]:bg-accent text-accent-foreground/80 data-[state=open]:bg-accent data-[active=true]:text-accent-foreground has-[svg]:size-9 has-[svg]:p-0',
        className,
      )}
      {...props}
    />
  );
}
