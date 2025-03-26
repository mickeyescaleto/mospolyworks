import { Elysia } from 'elysia';

import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { security } from '@/plugins/security';
import { NotificationService } from '@/modules/notification/notification.service';
import { tGetNotificationsResponse } from '@/modules/notification/schemas/get-notifications';
import {
  tDeleteNotificationParams,
  tDeleteNotificationResponse,
} from '@/modules/notification/schemas/delete-notification';
import {
  tReadNotificationsParams,
  tReadNotificationsResponse,
} from '@/modules/notification/schemas/read-notifications';

const logger = getLogger('Notifications');

export const notifications = new Elysia({
  prefix: '/notifications',
  tags: ['Notifications'],
}).guard((app) =>
  app
    .use(security)
    .get(
      '/',
      async ({ user, error }) => {
        try {
          const notifications = await NotificationService.getNotifications(
            user.id,
          );

          const message = `Notifications of the user with ID ${user.id} have been successfully received`;

          logger.info(message);

          return notifications;
        } catch {
          const message = 'An error occurred when receiving notifications';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        response: {
          200: tGetNotificationsResponse,
          500: tError,
        },
        detail: {
          summary: 'Get user notifications',
          description: 'Returns all notifications for the authenticated user',
        },
      },
    )
    .delete(
      '/:notificationId',
      async ({ params, user, error }) => {
        try {
          const notification = await NotificationService.deleteNotification(
            params.notificationId,
            user.id,
          );

          const message = `Notification with the ID ${notification.id} successfully deleted`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when deleting the notification';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tDeleteNotificationParams,
        response: {
          200: tDeleteNotificationResponse,
          500: tError,
        },
        detail: {
          summary: 'Delete notification',
          description: 'Permanently removes a specific notification',
        },
      },
    )
    .post(
      '/:notificationId/read',
      async ({ user, params, error }) => {
        try {
          const notification = await NotificationService.readNotification(
            params.notificationId,
            user.id,
          );

          const message = `Notification with the ID ${notification.id} read successfully`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when reading the notification';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tReadNotificationsParams,
        response: {
          200: tReadNotificationsResponse,
          500: tError,
        },
        detail: {
          summary: 'Mark notification as read',
          description: 'Updates notification read status',
        },
      },
    ),
);
