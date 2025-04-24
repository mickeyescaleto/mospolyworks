import { Elysia, NotFoundError } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { UserService } from '@/modules/user/user.service';
import { GetUserResponse } from '@/modules/user/schemas/routes/get-user';
import { GetUsersForProjectResponse } from '@/modules/user/schemas/routes/get-users-for-project';

const logger = getLogger('Users');

export const users = new Elysia({
  prefix: '/users',
  tags: ['Пользователи'],
})
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const user = await UserService.getUserById(params.id);

        const message = `User with the ID ${user.id} received successfully`;

        logger.info(message);

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          const message = error.message;

          logger.warn(message);

          set.status = 404;
          throw new Error(message);
        }

        const message = 'An error occurred when receiving the user';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      response: response(GetUserResponse),
      detail: {
        summary: 'Получить пользователя по идентификатору',
        description: 'Возвращает информацию о конкретном пользователе',
      },
    },
  )
  .guard((app) =>
    app.use(security).get(
      '/for-project',
      async ({ account, set }) => {
        try {
          const users = await UserService.getUsersForProject(account.id);

          const message = `Users have been successfully received`;

          logger.info(message);

          return users;
        } catch {
          const message = 'An error occurred when receiving users';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        response: response(GetUsersForProjectResponse),
        detail: {
          summary: 'Получить всех пользователей для обновления проекта',
          description:
            'Возвращает список со всеми пользователями для обновления проекта',
        },
      },
    ),
  );
