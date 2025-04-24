import { NotificationService } from '@/entities/notification/api/notification-service';

export type Notification = Awaited<
  ReturnType<typeof NotificationService.getNotifications>
>[number];
