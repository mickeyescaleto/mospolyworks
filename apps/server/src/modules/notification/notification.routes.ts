import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { NotificationService } from '@/modules/notification/notification.service';
import { GetNotificationsResponse } from '@/modules/notification/schemas/routes/get-notifications';
import { DeleteNotificationResponse } from '@/modules/notification/schemas/routes/delete-notification';
import { ReadNotificationsResponse } from '@/modules/notification/schemas/routes/read-notifications';

const logger = getLogger('Notifications');

export const notifications = new Elysia({
  prefix: '/notifications',
  tags: ['Уведомления'],
}).guard((app) =>
  app
    .use(security)
    .get(
      '/',
      async ({ account, set }) => {
        try {
          const notifications = await NotificationService.getNotifications(
            account.id,
          );

          const message = `Notifications of the user with ID ${account.id} have been successfully received`;

          logger.info(message);

          return notifications;
        } catch {
          const message = 'An error occurred when receiving notifications';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        response: response(GetNotificationsResponse),
        detail: {
          summary: 'Получить уведомления для авторизованного пользователя',
          description:
            'Возвращает список всех уведомлений для авторизованного пользователя',
        },
      },
    )
    .delete(
      '/:id',
      async ({ account, params, set }) => {
        try {
          const notification = await NotificationService.deleteNotification(
            params.id,
            account.id,
          );

          const message = `Notification with the ID ${notification.id} successfully deleted`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when deleting the notification';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        response: response(DeleteNotificationResponse),
        detail: {
          summary: 'Удалить уведомление',
          description:
            'Безвозвратно удаляет определенное уведомление авторизованного пользователя',
        },
      },
    )
    .post(
      '/:id/read',
      async ({ account, params, set }) => {
        try {
          const notification = await NotificationService.readNotification(
            params.id,
            account.id,
          );

          const message = `Notification with the ID ${notification.id} read successfully`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when reading the notification';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        response: response(ReadNotificationsResponse),
        detail: {
          summary: 'Отметить уведомление как прочитанное',
          description:
            'Отмечает уведомление авторизованного пользователя как прочитанное',
        },
      },
    ),
);
