import { NotificationCard } from '@/entities/notification/ui/notification-card';
import { type Notification } from '@/entities/notification/types/notification';

type NotificationListProps = {
  notifications: Notification[];
};

export function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return <p className="py-2 text-center text-sm">Уведомлений нет</p>;
  }

  return notifications.map((notification) => (
    <NotificationCard key={notification.id} notification={notification} />
  ));
}
