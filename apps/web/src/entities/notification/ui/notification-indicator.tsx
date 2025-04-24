import { type Notification } from '@/entities/notification/types/notification';

type NotificationIndicatorProps = {
  notifications: Notification[];
};

export function NotificationIndicator({
  notifications,
}: NotificationIndicatorProps) {
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  if (unreadNotifications.length === 0) {
    return null;
  }

  return (
    <span className="bg-destructive absolute top-2 right-2.5 size-1.5 rounded-full" />
  );
}
