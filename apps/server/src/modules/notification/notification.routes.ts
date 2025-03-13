import { Elysia } from 'elysia';

import { security } from '@/plugins/security';
import { NotificationService } from '@/modules/notification/notification.service';
import {
  tDeleteNotificationParams,
  tDeleteNotificationResponse,
} from '@/modules/notification/schemas/delete-notification';
import { tGetNotificationsResponse } from '@/modules/notification/schemas/get-notifications';

export const notifications = new Elysia({
  prefix: '/notifications',
  tags: ['notifications'],
}).guard((app) =>
  app
    .use(security)
    .get(
      '/',
      async ({ user }) => {
        return await NotificationService.getNotifications(user.id);
      },
      {
        response: {
          200: tGetNotificationsResponse,
        },
      },
    )
    .delete(
      '/:notificationId',
      async ({ params: { notificationId } }) => {
        return await NotificationService.deleteNotificationById(notificationId);
      },
      {
        params: tDeleteNotificationParams,
        response: {
          200: tDeleteNotificationResponse,
        },
      },
    ),
);
