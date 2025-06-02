import { Elysia } from 'elysia';
import superjson from 'superjson';

export const serialization = new Elysia()
  .onAfterHandle(({ request, response, set }) => {
    if (
      response &&
      !request.url.includes('/v1/swagger') &&
      !request.url.includes('/storage')
    ) {
      set.headers['X-Response-Format'] = 'superjson';
      return new Response(superjson.stringify(response));
    }
  })
  .as('plugin');
