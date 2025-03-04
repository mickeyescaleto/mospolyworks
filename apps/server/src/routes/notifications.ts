import { Elysia, t } from 'elysia';

import { NotificationService } from '@/services/notification';
import { authenticated } from '@/plugins/authenticated';

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
        const notification = await notificationService.notifications({
          where: { userId: id },
        });

        return notification;
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
