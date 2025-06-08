import { Elysia } from 'elysia';

import { config } from '@/config';
import { jsonwebtokens } from '@/plugins/jsonwebtokens';
import { Cookie } from '@/schemas/cookie';
import { SessionService } from '@/modules/session/session.service';

export const account = new Elysia()
  .use(jsonwebtokens)
  .guard({ cookie: Cookie })
  .resolve(async ({ cookie, ajwt, rjwt }) => {
    try {
      if (cookie['access_token'].value) {
        const payload = await ajwt.verify(cookie['access_token'].value);

        if (!payload) {
          return undefined;
        }

        return {
          account: {
            id: payload.id,
            roles: payload.roles,
          },
        };
      }

      if (cookie['refresh_token'].value) {
        const payload = await rjwt.verify(cookie['refresh_token'].value);

        if (!payload) {
          return undefined;
        }

        const session = await SessionService.getSessionByToken(
          cookie['refresh_token'].value,
        );

        const account = {
          id: session.user.id,
          roles: session.user.roles,
        };

        const tokens: Record<string, string> = {};

        tokens['access_token'] = await ajwt.sign(account);
        tokens['refresh_token'] = await rjwt.sign(account);

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

        return { account };
      }

      return undefined;
    } catch {
      return undefined;
    }
  })
  .as('plugin');
