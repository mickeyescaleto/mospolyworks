'use client';

import { useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { CheckCheck, LinkIcon, XIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/ui/core/dropdown-menu';

import { useReadNotification } from '@/entities/notification/model/use-read-notification';
import { useDeleteNotification } from '@/entities/notification/model/use-delete-notification';
import { type Notification } from '@/entities/notification/types/notification';

type NotificationCardProps = {
  notification: Notification;
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const { ref, inView } = useInView();

  const { mutate: readNotification } = useReadNotification();
  const { mutate: deleteNotification } = useDeleteNotification();

  console.log(notification);

  useEffect(() => {
    if (!notification.isRead && inView) {
      readNotification(notification.id);
    }
  }, [notification, inView, readNotification]);

  return (
    <Fragment>
      <DropdownMenuItem
        ref={ref}
        onSelect={(event) => event.preventDefault()}
        className="h-auto cursor-default flex-col items-stretch gap-1 p-2"
      >
        <div className="flex gap-1">
          <p
            title={notification.title}
            className="line-clamp-2 flex-1 font-medium"
          >
            {notification.title}
          </p>

          {notification.link && (
            <Button
              variant="void"
              size="icon"
              className="size-4 opacity-75 hover:opacity-100"
              asChild
            >
              <Link href={notification.link} target="_blank">
                <LinkIcon className="size-3" />
              </Link>
            </Button>
          )}

          <Button
            type="button"
            variant="void"
            size="icon"
            onClick={() => deleteNotification(notification.id)}
            className="size-4 opacity-75 hover:opacity-100"
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        <p className="text-foreground line-clamp-3">{notification.content}</p>

        <div className="flex items-center justify-end gap-1">
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {formatDistanceToNow(String(notification.createdAt), {
              addSuffix: true,
              locale: ru,
            })}
          </p>

          {notification.isRead && (
            <CheckCheck className="text-muted-foreground size-3" />
          )}
        </div>
      </DropdownMenuItem>

      <DropdownMenuSeparator className="last:hidden" />
    </Fragment>
  );
}
