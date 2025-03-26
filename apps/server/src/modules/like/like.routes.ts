import { Elysia } from 'elysia';

import { tCookie } from '@/schemas/cookie';
import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { security } from '@/plugins/security';
import { LikeService } from '@/modules/like/like.service';
import { tSetUserHashResponse } from '@/modules/like/schemas/set-user-hash';
import {
  tCreateAnonymousLikeParams,
  tCreateAnonymousLikeResponse,
} from '@/modules/like/schemas/create-anonymous-like';
import {
  tDeleteAnonymousLikeParams,
  tDeleteAnonymousLikeResponse,
} from '@/modules/like/schemas/delete-anonymous-like';
import {
  tCreateLikeParams,
  tCreateLikeResponse,
} from '@/modules/like/schemas/create-like';
import {
  tDeleteLikeParams,
  tDeleteLikeResponse,
} from '@/modules/like/schemas/delete-like';

const logger = getLogger('Likes');

export const likes = new Elysia({
  prefix: '/likes',
  tags: ['Likes'],
})
  .guard({ cookie: tCookie })
  .post(
    '/set-user-hash',
    async ({ cookie }) => {
      if (cookie['user_hash'].value) {
        const message = 'User hash has already been set';

        logger.info(message);

        return message;
      }

      const hash = crypto.randomUUID();

      await cookie['user_hash'].set({
        value: hash,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      });

      const message = `User hash ${hash} was successfully set`;

      logger.info(message);

      return message;
    },
    {
      response: {
        200: tSetUserHashResponse,
      },
      detail: {
        summary: 'Set user hash',
        description: 'Generates and sets a unique cookie hash for users',
      },
    },
  )
  .post(
    '/anonymous/:projectId',
    async ({ params, cookie, error }) => {
      try {
        const hash = cookie['user_hash'].value;

        if (!hash) {
          const message = 'User hash was not found in cookies';

          logger.warn(message);

          return error('Bad Request', { message });
        }

        const like = await LikeService.createAnonymousLike(
          params.projectId,
          hash,
        );

        const message = `Like with the ID ${like.id} has been successfully created`;

        logger.info(message);

        return message;
      } catch {
        const message = 'An error occurred when creating the like';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      params: tCreateAnonymousLikeParams,
      response: {
        200: tCreateAnonymousLikeResponse,
        400: tError,
        500: tError,
      },
      detail: {
        summary: 'Create anonymous like',
        description: 'Adds a like to a project from anonymous user',
      },
    },
  )
  .delete(
    '/anonymous/:projectId',
    async ({ params, cookie, error }) => {
      try {
        const hash = cookie['user_hash'].value;

        if (!hash) {
          const message = 'User hash was not found in cookies';

          logger.warn(message);

          return error('Bad Request', { message });
        }

        const like = await LikeService.deleteAnonymousLike(
          params.projectId,
          hash,
        );

        const message = `Like with the ID ${like.id} has been successfully deleted`;

        logger.info(message);

        return message;
      } catch {
        const message = 'An error occurred when deleting the like';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      params: tDeleteAnonymousLikeParams,
      response: {
        200: tDeleteAnonymousLikeResponse,
        400: tError,
        500: tError,
      },
      detail: {
        summary: 'Remove anonymous like',
        description: 'Deletes an anonymous like',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .post(
        '/:projectId',
        async ({ user, params, error }) => {
          try {
            const like = await LikeService.createLike(
              params.projectId,
              user.id,
            );

            const message = `Like with the ID ${like.id} has been successfully created`;

            logger.info(message);

            return message;
          } catch {
            const message = 'An error occurred when creating the like';

            logger.error(message);

            return error('Internal Server Error', { message });
          }
        },
        {
          params: tCreateLikeParams,
          response: {
            200: tCreateLikeResponse,
            500: tError,
          },
          detail: {
            summary: 'Create authenticated like',
            description: 'Registers a like from authenticated user account',
          },
        },
      )
      .delete(
        '/:projectId',
        async ({ user, params, error }) => {
          try {
            const like = await LikeService.deleteLike(
              params.projectId,
              user.id,
            );

            const message = `Like with the ID ${like.id} has been successfully deleted`;

            logger.info(message);

            return message;
          } catch {
            const message = 'An error occurred when deleting the like';

            logger.error(message);

            return error('Internal Server Error', { message });
          }
        },
        {
          params: tDeleteLikeParams,
          response: {
            200: tDeleteLikeResponse,
            500: tError,
          },
          detail: {
            summary: 'Remove authenticated like',
            description: 'Deletes a like from authenticated user account',
          },
        },
      ),
  );
