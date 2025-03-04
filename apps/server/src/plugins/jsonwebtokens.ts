import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { config } from '@/config';
import { tPayload } from '@/schemas/payload';

export const jsonwebtokens = () =>
  new Elysia({ name: 'plugins.jsonwebtokens' })
    .use(
      jwt({
        name: 'ajwt',
        secret: config.ajwt.secret,
        exp: `${config.ajwt.expires}s`,
        schema: tPayload,
      }),
    )
    .use(
      jwt({
        name: 'rjwt',
        secret: config.rjwt.secret,
        exp: `${config.rjwt.expires}s`,
        schema: tPayload,
      }),
    )
    .as('plugin');
