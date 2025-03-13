import { Elysia } from 'elysia';

import { config } from '@/config';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { UserService } from '@/modules/user/user.service';
import { SessionService } from '@/modules/session/session.service';
import { tError } from '@/schemas/error';
import { tCookie } from '@/modules/auth/schemas/cookie';
import { tRole } from '@/modules/user/schemas/role';

type UseRolesProps = {
  roles: (typeof tRole.static)[];
  type?: 'some' | 'every';
};

export const security = new Elysia()
  .use(jsonwebtokens)
  .guard({
    cookie: tCookie,
    response: {
      401: tError,
      403: tError,
    },
  })
  .resolve(async ({ cookie: { atoken, rtoken }, ajwt, rjwt, error }) => {
    if (atoken.value) {
      const payload = await ajwt.verify(atoken.value);

      if (!payload) {
        atoken.remove();
        return error('Unauthorized', { message: 'Unauthorized' });
      }

      return { user: { id: payload.id, roles: payload.roles } };
    }

    if (rtoken.value) {
      const payload = await rjwt.verify(rtoken.value);

      if (!payload) {
        rtoken.remove();
        return error('Unauthorized', { message: 'Unauthorized' });
      }

      const session = await SessionService.getSessionByToken(rtoken.value);

      if (!session) {
        rtoken.remove();
        return error('Unauthorized', { message: 'Unauthorized' });
      }

      const user = await UserService.getUserById(payload.id);

      if (!user) {
        rtoken.remove();
        return error('Unauthorized', { message: 'Unauthorized' });
      }

      const tokens = {
        atoken: await ajwt.sign({ id: user.id, roles: user.roles }),
        rtoken: await rjwt.sign({ id: user.id, roles: user.roles }),
      };

      await SessionService.updateSessionByToken(rtoken.value, tokens.rtoken);

      atoken.set({
        value: tokens.atoken,
        maxAge: config.ajwt.expires,
        httpOnly: true,
        secure: true,
      });
      rtoken.set({
        value: tokens.rtoken,
        maxAge: config.rjwt.expires,
        httpOnly: true,
        secure: true,
      });

      return { user: { id: user.id, roles: user.roles } };
    }

    return error('Unauthorized', { message: 'Unauthorized' });
  })
  .macro(({ onBeforeHandle }) => ({
    useRoles({ roles, type = 'some' }: UseRolesProps) {
      onBeforeHandle(({ user, set }) => {
        if (!roles[type]((role) => user?.roles.includes(role))) {
          set.status = 'Forbidden';
          return {
            message: 'Access is denied due to insufficient permissions',
          };
        }
      });
    },
  }))
  .as('plugin');
