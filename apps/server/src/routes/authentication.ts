import { Elysia } from 'elysia';
import { AxiosError } from 'axios';

import { config } from '@/config';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { authenticated } from '@/plugins/authenticated';
import { UserService } from '@/services/user';
import { SessionService } from '@/services/session';
import { getExpirationDate } from '@/utilities/get-expiration-date';
import { convertResponse } from '@/utilities/convert-response';
import { tCookie } from '@/schemas/cookie';
import { tUserLoginCredentials, tUserResponse } from '@/schemas/user';
import type { Payload } from '@/types/payload';

export const authentication = new Elysia({
  name: 'routes.authentication',
  prefix: '/authentication',
})
  .use(jsonwebtokens())
  .decorate({
    userService: new UserService(),
    sessionService: new SessionService(),
  })
  .guard({ cookie: tCookie })
  .resolve(async ({ cookie, ajwt, rjwt, sessionService }) => {
    const setCookies = async (payload: Payload) => {
      const atoken = await ajwt.sign({ ...payload });
      const rtoken = await rjwt.sign({ ...payload });

      cookie.atoken.set({
        value: atoken,
        maxAge: config.ajwt.expires,
        httpOnly: true,
        secure: true,
      });
      cookie.rtoken.set({
        value: rtoken,
        maxAge: config.rjwt.expires,
        httpOnly: true,
        secure: true,
      });

      return { atoken, rtoken };
    };

    const removeCookies = () => {
      cookie.atoken.remove();
      cookie.rtoken.remove();
    };

    const createSession = async (userId: string, token: string) => {
      await sessionService.create({
        data: {
          user: { connect: { id: userId } },
          expiresAt: getExpirationDate(config.rjwt.expires),
          token,
        },
      });
    };

    return { setCookies, removeCookies, createSession };
  })
  .post(
    '/login',
    async ({
      body: { login, password },
      userService,
      createSession,
      setCookies,
      error,
    }) => {
      try {
        const user = await userService.user({ where: { login } });

        if (user) {
          const isCorrectPassword = await Bun.password.verify(
            password,
            user.password,
            'bcrypt',
          );

          if (!isCorrectPassword) {
            return error('Bad Request', 'Invalid login or password');
          }

          const { rtoken } = await setCookies({
            id: user.id,
            roles: user.roles,
          });

          await createSession(user.id, rtoken);

          return convertResponse(user, tUserResponse);
        }

        const data = await userService.externalUser({ login, password });

        const createdUser = await userService.create({ data });

        const { rtoken } = await setCookies({
          id: createdUser.id,
          roles: createdUser.roles,
        });

        await createSession(createdUser.id, rtoken);

        return convertResponse(createdUser, tUserResponse);
      } catch (err) {
        if (err instanceof AxiosError) {
          switch (err.status) {
            case 400:
              return error('Bad Request', 'Invalid login or password');
            case 500:
              return error(
                'Service Unavailable',
                'The external API is not available',
              );
          }
        }

        return error('Internal Server Error');
      }
    },
    {
      body: tUserLoginCredentials,
    },
  )
  .guard((app) =>
    app
      .use(authenticated())
      .get('/profile', async ({ user: { id }, userService }) => {
        const user = await userService.user({ where: { id } });

        return convertResponse(user, tUserResponse);
      })
      .get('/logout', async ({ cookie, sessionService, removeCookies }) => {
        await sessionService.delete({ where: { token: cookie.rtoken.value } });

        removeCookies();

        return `The user has successfully logged out`;
      }),
  );
