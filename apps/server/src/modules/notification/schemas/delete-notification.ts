import { t } from 'elysia';

import { tNotification } from '@/modules/notification/schemas/notification';

export const tDeleteNotificationParams = t.Object({
  notificationId: t.String(),
});

export const tDeleteNotificationResponse = tNotification;
