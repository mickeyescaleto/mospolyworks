import { Elysia, t } from 'elysia';

import { authenticated } from '@/plugins/authenticated';
import { NotificationService } from '@/services/notification';

export const notifications = new Elysia({
  name: 'routes.notifications',
  prefix: '/notifications',
})
  .decorate({
    notificationService: new NotificationService(),
  })
  .guard((app) =>
    app
      .use(authenticated())
      .get('/', async ({ user: { id }, notificationService }) => {
        const notifications = await notificationService.notifications({
          where: { userId: id },
        });

        return notifications;
      })
      .delete(
        '/:notificationId',
        async ({ params: { notificationId }, notificationService }) => {
          const notification = await notificationService.delete({
            where: { id: notificationId },
          });

          return notification;
        },
        {
          params: t.Object({
            notificationId: t.String(),
          }),
        },
      ),
  );
