import { Elysia } from 'elysia';

import { config } from '@/config';
import { UnauthorizedError } from '@/errors/unauthorized';
import { tCookie } from '@/schemas/cookie';
import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { SessionService } from '@/modules/session/session.service';
import { type Role } from '@/modules/user/schemas/role';

const logger = getLogger('Security');

type UseRolesProps = {
  roles: Role[];
  type?: 'some' | 'every';
};

export const security = new Elysia()
  .use(jsonwebtokens)
  .guard({
    cookie: tCookie,
    response: {
      401: tError,
      403: tError,
      500: tError,
    },
    detail: {
      security: [{ AccessTokenCookie: [] }, { RefreshTokenCookie: [] }],
    },
  })
  .resolve(async ({ cookie, error, ajwt, rjwt }) => {
    try {
      if (cookie['access_token'].value) {
        const payload = await ajwt.verify(cookie['access_token'].value);

        if (!payload) {
          throw new UnauthorizedError('Invalid access token');
        }

        return {
          user: {
            id: payload.id,
            roles: payload.roles,
          },
        };
      }

      if (cookie['refresh_token'].value) {
        const payload = await rjwt.verify(cookie['refresh_token'].value);

        if (!payload) {
          throw new UnauthorizedError('Invalid refresh token');
        }

        const session = await SessionService.getSessionByToken(
          cookie['refresh_token'].value,
        );

        const user = {
          id: session.user.id,
          roles: session.user.roles,
        };

        const tokens: Record<string, string> = {};

        tokens['access_token'] = await ajwt.sign(user);
        tokens['refresh_token'] = await rjwt.sign(user);

        await SessionService.updateSessionByToken(
          session.id,
          tokens['refresh_token'],
        );

        cookie['access_token'].set({
          value: tokens['access_token'],
          maxAge: config.ajwt.expires,
        });
        cookie['refresh_token'].set({
          value: tokens['refresh_token'],
          maxAge: config.rjwt.expires,
        });

        return { user };
      }

      throw new UnauthorizedError('Access and refresh tokens are missing');
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        cookie['access_token'].remove();
        cookie['refresh_token'].remove();

        const message = e.message;

        logger.warn(message);

        return error('Unauthorized', { message });
      }

      const message = 'An error occurred during authorization';

      logger.error(message);

      return error('Internal Server Error', { message });
    }
  })
  .macro(({ onBeforeHandle }) => ({
    useRoles({ roles, type = 'some' }: UseRolesProps) {
      onBeforeHandle(({ user, set }) => {
        if (!roles[type]((role) => user?.roles.includes(role))) {
          const message = 'Access is denied due to insufficient permissions';

          logger.warn(message);

          set.status = 'Forbidden';

          return { message };
        }
      });
    },
  }))
  .as('plugin');
