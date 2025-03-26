import { t } from 'elysia';

export const tDeleteNotificationParams = t.Object({
  notificationId: t.String(),
});

export const tDeleteNotificationResponse = t.String();
