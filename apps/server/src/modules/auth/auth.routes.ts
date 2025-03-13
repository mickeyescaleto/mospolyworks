import { Elysia } from 'elysia';
import { AxiosError } from 'axios';

import { config } from '@/config';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { security } from '@/plugins/security';
import { UserService } from '@/modules/user/user.service';
import { SessionService } from '@/modules/session/session.service';
import { tError } from '@/schemas/error';
import { tPayload } from '@/schemas/payload';
import { tCookie } from '@/modules/auth/schemas/cookie';
import { tLoginBody, tLoginResponse } from '@/modules/auth/schemas/login';
import { tLogoutResponse } from '@/modules/auth/schemas/logout';
import { tGetProfileResponse } from '@/modules/auth/schemas/profile';

export const auth = new Elysia({
  prefix: '/auth',
  tags: ['auth'],
})
  .use(jsonwebtokens)
  .guard({ cookie: tCookie })
  .resolve(async ({ cookie, ajwt, rjwt }) => {
    const setCookies = async (payload: typeof tPayload.static) => {
      const tokens = {
        atoken: await ajwt.sign(payload),
        rtoken: await rjwt.sign(payload),
      };

      cookie.atoken.set({
        value: tokens.atoken,
        maxAge: config.ajwt.expires,
        httpOnly: true,
        secure: true,
      });
      cookie.rtoken.set({
        value: tokens.rtoken,
        maxAge: config.rjwt.expires,
        httpOnly: true,
        secure: true,
      });

      return tokens;
    };

    const removeCookies = () => {
      cookie.atoken.remove();
      cookie.rtoken.remove();
    };

    const createSession = async (userId: string, token: string) => {
      await SessionService.createSession(userId, token);
    };

    return { setCookies, removeCookies, createSession };
  })
  .post(
    '/login',
    async ({ body: { login, password }, createSession, setCookies, error }) => {
      try {
        const user = await UserService.getUserByLogin(login);

        if (user) {
          const isCorrectPassword = await Bun.password.verify(
            password,
            user.password,
            'bcrypt',
          );

          if (!isCorrectPassword) {
            return error('Bad Request', {
              message: 'Invalid login or password',
            });
          }

          const { rtoken } = await setCookies({
            id: user.id,
            roles: user.roles,
          });

          await createSession(user.id, rtoken);

          return user;
        }

        const data = await UserService.getExternalUser({ login, password });

        const createdUser = await UserService.createUser(data);

        const { rtoken } = await setCookies({
          id: createdUser.id,
          roles: createdUser.roles,
        });

        await createSession(createdUser.id, rtoken);

        return createdUser;
      } catch (e) {
        if (e instanceof AxiosError) {
          switch (e.status) {
            case 400:
              return error('Bad Request', {
                message: 'Invalid login or password',
              });
            case 500:
              return error('Service Unavailable', {
                message: 'The external API is not available',
              });
          }
        }

        return error('Internal Server Error', {
          message: 'Internal Server Error',
        });
      }
    },
    {
      body: tLoginBody,
      response: {
        200: tLoginResponse,
        400: tError,
        500: tError,
        503: tError,
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/logout',
        async ({ cookie, removeCookies }) => {
          await SessionService.deleteSessionByToken(cookie.rtoken.value!);

          removeCookies();

          return `The user has successfully logged out`;
        },
        {
          response: {
            200: tLogoutResponse,
          },
        },
      )
      .get(
        '/profile',
        async ({ user: { id }, error }) => {
          const user = await UserService.getUserById(id);

          if (!user) {
            return error('Internal Server Error', {
              message: 'Internal Server Error',
            });
          }

          return user;
        },
        {
          response: {
            200: tGetProfileResponse,
            500: tError,
          },
        },
      ),
  );
