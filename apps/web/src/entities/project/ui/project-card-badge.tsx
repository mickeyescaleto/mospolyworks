'use client';

import { ComponentProps, ReactNode } from 'react';

import { Badge } from '@repo/ui/core/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/core/tooltip';
import { cn } from '@repo/ui/utilities/cn';

type ProjectCardBadgeProps = {
  badge: ReactNode;
  tooltip?: {
    content: ReactNode;
    side: 'top' | 'bottom';
  };
} & ComponentProps<'span'>;

export function ProjectCardBadge({
  badge,
  tooltip,
  className,
  ...props
}: ProjectCardBadgeProps) {
  if (!tooltip) {
    return (
      <Badge
        onClick={(event) => event.preventDefault()}
        variant="glassy"
        size="default"
        className={cn('cursor-default', className)}
        {...props}
      >
        {badge}
      </Badge>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger onClick={(event) => event.preventDefault()} asChild>
        <Badge
          variant="glassy"
          size="default"
          className={cn('cursor-default', className)}
          {...props}
        >
          {badge}
        </Badge>
      </TooltipTrigger>

      <TooltipContent
        onClick={(event) => event.preventDefault()}
        align="center"
        side={tooltip.side}
      >
        {tooltip.content}
      </TooltipContent>
    </Tooltip>
  );
}
