'use client';

import Link from 'next/link';

import { LinkIcon, XIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import { useNotification } from '@/hooks/use-notification';
import { Notification } from '@/types/notification';

type NotificationCardProps = {
  notification: Notification;
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const { useDelete } = useNotification();
  const { mutate: deleteNotification } = useDelete();

  return (
    <div className="flex flex-col gap-y-1 rounded-lg bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800/75">
      <div className="flex gap-x-1">
        <p className="line-clamp-2 flex-1 font-semibold">
          {notification.title}
        </p>
        <div className="flex">
          {notification.link && (
            <Button
              variant="ghost"
              size="icon"
              className="size-5 opacity-50 hover:bg-transparent hover:opacity-100 dark:hover:bg-transparent"
              asChild
            >
              <Link href={notification.link}>
                <LinkIcon className="size-3" />
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-5 opacity-50 hover:bg-transparent hover:opacity-100 dark:hover:bg-transparent"
            onClick={() => deleteNotification(notification.id)}
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      </div>
      <p className="line-clamp-3 font-medium">{notification.content}</p>
    </div>
  );
}
