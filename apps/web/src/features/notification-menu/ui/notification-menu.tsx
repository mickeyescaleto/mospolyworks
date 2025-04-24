'use client';

import { BellIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/core/dropdown-menu';

import { NotificationMenuSkeleton } from '@/features/notification-menu/ui/notification-menu-skeleton';
import {
  NotificationIndicator,
  NotificationList,
  useNotifications,
} from '@/entities/notification';

export function NotificationMenu() {
  const { data: notifications, isPending } = useNotifications();

  if (isPending) {
    return <NotificationMenuSkeleton />;
  }

  if (!notifications) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="size-4" />

                <NotificationIndicator notifications={notifications} />

                <span className="sr-only">Уведомления</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <DropdownMenuContent
            align="end"
            className="flex max-h-48 w-64 flex-col"
          >
            <NotificationList notifications={notifications} />
          </DropdownMenuContent>

          <TooltipContent side="bottom">
            <p>Уведомления</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
