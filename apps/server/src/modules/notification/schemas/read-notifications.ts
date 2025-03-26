import { t } from 'elysia';

export const tReadNotificationsParams = t.Object({
  notificationId: t.String(),
});

export const tReadNotificationsResponse = t.String();
