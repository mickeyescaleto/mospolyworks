import { Elysia, NotFoundError } from 'elysia';

import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { UserService } from '@/modules/user/user.service';
import {
  tGetUserParams,
  tGetUserResponse,
} from '@/modules/user/schemas/get-user';

const logger = getLogger('Users');

export const users = new Elysia({
  prefix: '/users',
  tags: ['Users'],
}).get(
  '/:userId',
  async ({ params, error }) => {
    try {
      const user = await UserService.getUserById(params.userId);

      const message = `User with the ID ${user.id} received successfully`;

      logger.info(message);

      return user;
    } catch (e) {
      if (e instanceof NotFoundError) {
        const message = e.message;

        logger.warn(message);

        return error('Not Found', { message });
      }

      const message = 'An error occurred when receiving the user';

      logger.error(message);

      return error('Internal Server Error', { message });
    }
  },
  {
    params: tGetUserParams,
    response: {
      200: tGetUserResponse,
      404: tError,
      500: tError,
    },
    detail: {
      summary: 'Get user by ID',
      description: 'Returns detailed information about a specific user',
    },
  },
);
