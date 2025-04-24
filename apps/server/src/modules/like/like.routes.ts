import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { client } from '@/plugins/client';
import { account } from '@/plugins/account';
import { LikeService } from '@/modules/like/like.service';
import { response } from '@/utilities/response';
import {
  CreateLikeBody,
  CreateLikeResponse,
} from '@/modules/like/schemas/routes/create-like';
import { DeleteLikeResponse } from '@/modules/like/schemas/routes/delete-like';

const logger = getLogger('Likes');

export const likes = new Elysia({
  prefix: '/likes',
  tags: ['Лайки'],
}).guard((app) =>
  app
    .use(client)
    .use(account)
    .post(
      '/',
      async ({ client, account, body, set }) => {
        try {
          const like = await LikeService.createLike(body.projectId, {
            client,
            account: account?.id,
          });

          const message = `Like with the ID ${like.id} has been successfully created`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when creating the like';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        body: CreateLikeBody,
        response: response(CreateLikeResponse),
        detail: {
          summary: 'Поставить лайк',
          description: 'Добавляет лайк проекту',
        },
      },
    )
    .delete(
      '/:id',
      async ({ client, account, params, set }) => {
        try {
          const like = await LikeService.deleteLike(params.id, {
            client,
            account: account?.id,
          });

          const message = `Like with the ID ${like.id} has been successfully deleted`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when deleting the like';

          logger.error(message);

          set.status = 500;
          throw new Error(message);
        }
      },
      {
        response: response(DeleteLikeResponse),
        detail: {
          summary: 'Удалить лайк',
          description: 'Удаляет лайк у проекта',
        },
      },
    ),
);
