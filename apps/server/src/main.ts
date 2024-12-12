import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get('/', () => 'Hello Elysia')
  .listen(3000, ({ url }) =>
    console.log(`🦊 Application is running at ${url}`),
  );
