import { Elysia } from 'elysia';

import { Cookie } from '@/schemas/cookie';

export const client = new Elysia()
  .guard({ cookie: Cookie })
  .resolve(async ({ cookie }) => {
    if (cookie.client.value) {
      return { client: cookie.client.value };
    }

    const client = crypto.randomUUID();

    await cookie.client.set({
      value: client,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    });

    return { client };
  })
  .as('plugin');
