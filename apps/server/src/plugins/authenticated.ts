import { Elysia, Static, t } from 'elysia';
import { config } from '@/config';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { UserService } from '@/services/user';
import { SessionService } from '@/services/session';
import { getExpirationDate } from '@/utilities/get-expiration-date';
import { tCookie } from '@/schemas/cookie';
import { Payload } from '@/types/payload';
import { tRole } from '@/schemas/role';

const tRolesProps = t.Object({
  roles: t.Array(tRole),
  type: t.Optional(t.Union([t.Literal('some'), t.Literal('every')])),
});

type RolesProps = Static<typeof tRolesProps>;

export const authenticated = () =>
  new Elysia({ name: 'plugins.authenticated' })
    .use(jsonwebtokens())
    .decorate({
      userService: new UserService(),
      sessionService: new SessionService(),
    })
    .guard({ cookie: tCookie })
    .resolve(
      async ({ cookie, ajwt, rjwt, userService, sessionService, error }) => {
        if (cookie.atoken.value) {
          const payload = (await ajwt.verify(cookie.atoken.value)) as Payload;

          if (!payload) {
            cookie.atoken.remove();
            return error('Unauthorized');
          }

          return { user: { id: payload.id, roles: payload.roles } };
        }

        if (cookie.rtoken.value) {
          const payload = (await rjwt.verify(cookie.rtoken.value)) as Payload;

          if (!payload) {
            cookie.rtoken.remove();
            return error('Unauthorized');
          }

          const session = await sessionService.session({
            where: { token: cookie.rtoken.value },
          });

          if (!session) {
            cookie.rtoken.remove();
            return error('Unauthorized');
          }

          const user = await userService.user({
            where: { id: payload.id },
          });

          if (!user) {
            cookie.rtoken.remove();
            return error('Unauthorized');
          }

          const atoken = await ajwt.sign({ id: user.id, roles: user.roles });
          const rtoken = await rjwt.sign({ id: user.id, roles: user.roles });

          await sessionService.update({
            where: { token: cookie.rtoken.value },
            data: {
              token: rtoken,
              expiresAt: getExpirationDate(config.rjwt.expires),
            },
          });

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

          return { user: { id: user.id, roles: user.roles } };
        }

        return error('Unauthorized');
      },
    )
    .macro(({ onBeforeHandle }) => ({
      useRoles({ roles, type = 'some' }: RolesProps) {
        onBeforeHandle(({ user, error }) => {
          if (!roles[type]((role) => user?.roles.includes(role))) {
            return error(
              'Forbidden',
              'Access is denied due to insufficient permissions',
            );
          }
        });
      },
    }))
    .as('plugin');
