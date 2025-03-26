import { Elysia, NotFoundError } from 'elysia';

import { config } from '@/config';
import { BadRequestError } from '@/errors/bad-request';
import { tCookie } from '@/schemas/cookie';
import { tError } from '@/schemas/error';
import { type Payload } from '@/schemas/payload';
import { getLogger } from '@/utilities/logger';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { security } from '@/plugins/security';
import { AccountService } from '@/modules/account/account.service';
import { UserService } from '@/modules/user/user.service';
import { SessionService } from '@/modules/session/session.service';
import { tLoginBody, tLoginResponse } from '@/modules/account/schemas/login';
import { tGetProfileResponse } from '@/modules/account/schemas/get-profile';
import { tLogoutResponse } from '@/modules/account/schemas/logout';

const logger = getLogger('Accounts');

export const accounts = new Elysia({
  prefix: '/accounts',
  tags: ['Accounts'],
})
  .guard({ cookie: tCookie })
  .use(jsonwebtokens)
  .resolve(async ({ cookie, ajwt, rjwt }) => {
    async function setCookies(payload: Payload) {
      cookie['access_token'].set({
        value: await ajwt.sign(payload),
        maxAge: config.ajwt.expires,
      });
      cookie['refresh_token'].set({
        value: await rjwt.sign(payload),
        maxAge: config.rjwt.expires,
      });

      return cookie['refresh_token'].value!;
    }

    return { setCookies };
  })
  .post(
    '/login',
    async ({ setCookies, body, error }) => {
      try {
        const user = await UserService.getUserByLogin(body.login).catch(
          () => null,
        );

        if (!user) {
          const externalAccountData =
            await AccountService.getExternalAccount(body);

          const user = await UserService.createUser(externalAccountData);

          const token = await setCookies({
            id: user.id,
            roles: user.roles,
          });

          await SessionService.createSession(user.id, token);

          const message = `User with ID ${user.id} has been successfully created and logged in`;

          logger.info(message);

          return user;
        }

        const externalAccountData =
          await AccountService.getExternalAccount(body);

        if (user.roles.includes('ADMIN')) {
          externalAccountData.roles.push('ADMIN');
        }

        const actualizedUser = await UserService.updateUser(
          user.id,
          externalAccountData,
        );

        const token = await setCookies({
          id: actualizedUser.id,
          roles: actualizedUser.roles,
        });

        await SessionService.createSession(actualizedUser.id, token);

        const message = `User with ID ${actualizedUser.id} has successfully logged in`;

        logger.info(message);

        return actualizedUser;
      } catch (e) {
        if (e instanceof BadRequestError) {
          const message = e.message;

          logger.warn(message);

          return error('Bad Request', { message });
        }

        const message = 'An error occurred when authorizing the user';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      body: tLoginBody,
      response: {
        200: tLoginResponse,
        400: tError,
        500: tError,
      },
      detail: {
        summary: 'User authentication',
        description: 'Verifies user credentials and issues tokens',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/profile',
        async ({ user, error }) => {
          try {
            const profile = await UserService.getUserById(user.id);

            const message = `User with the ID ${user.id} received successfully`;

            logger.info(message);

            return profile;
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
          response: {
            200: tGetProfileResponse,
            404: tError,
            500: tError,
          },
          detail: {
            summary: 'Get user data',
            description: 'Returns user data of authenticated user',
          },
        },
      )
      .post(
        '/logout',
        async ({ user, cookie, error }) => {
          try {
            await SessionService.deleteSessionByToken(
              cookie['refresh_token'].value!,
            );

            cookie['access_token'].remove();
            cookie['refresh_token'].remove();

            const message = `User with the ID ${user.id} logged out successfully`;

            logger.info(message);

            return message;
          } catch {
            const message = 'An error occurred when the user logged out';

            logger.error(message);

            return error('Internal Server Error', { message });
          }
        },
        {
          response: {
            200: tLogoutResponse,
            500: tError,
          },
          detail: {
            summary: 'User logout',
            description:
              'Invalidates current session tokens and clears authentication cookies',
          },
        },
      ),
  );
