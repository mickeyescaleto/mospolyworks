'use client';

import { ReactNode } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/core/popover';

import { useTouchDevice } from '@/shared/hooks/use-touch-device';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/ui/core/hover-card';

type AdaptiveInteractionProps = {
  trigger: ReactNode;
  content: ReactNode;
  align?: 'start' | 'center' | 'end';
  classNames?: {
    content?: string;
  };
};

export function AdaptiveInteraction({
  trigger,
  content,
  align = 'start',
  classNames,
}: AdaptiveInteractionProps) {
  const isTouchDevice = useTouchDevice();

  if (isTouchDevice) {
    return (
      <Popover modal>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>

        <PopoverContent align={align} className={classNames?.content}>
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>

      <HoverCardContent
        onPointerDownOutside={(event) => event.preventDefault()}
        align={align}
        className={classNames?.content}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
