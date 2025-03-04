import { NotificationService } from '@/services/notification';

export type Notification = Awaited<
  ReturnType<typeof NotificationService.getNotifications>
>[number];
