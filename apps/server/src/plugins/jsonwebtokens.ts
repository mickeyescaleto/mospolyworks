import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

import { config } from '@/config';
import { Payload } from '@/schemas/payload';

export const jsonwebtokens = new Elysia()
  .use(
    jwt({
      name: 'ajwt',
      secret: config.ajwt.secret,
      exp: `${config.ajwt.expires}s`,
      schema: Payload,
    }),
  )
  .use(
    jwt({
      name: 'rjwt',
      secret: config.rjwt.secret,
      exp: `${config.rjwt.expires}s`,
      schema: Payload,
    }),
  )
  .as('plugin');
