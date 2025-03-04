'use client';

import { Popover, PopoverTrigger, PopoverContent } from '@repo/ui/core/popover';
import { Button } from '@repo/ui/core/button';
import { BellIcon } from '@repo/ui/core/icons';
import { NotificationCard } from '@/components/notification-card';
import { useNotification } from '@/hooks/use-notification';

export function NotificationPopover() {
  const { useNotifications } = useNotification();
  const { data: notifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="header" size="icon">
          <BellIcon className="size-4.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <div className="hidden-scrollbar flex max-h-64 flex-col gap-y-1 overflow-y-auto rounded-lg">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <p className="py-2 text-center text-sm">Уведомлений нет</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
