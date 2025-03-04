import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

import { config } from '@/config';
import { authentication } from '@/routes/authentication';
import { notifications } from '@/routes/notifications';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(authentication)
  .use(notifications)
  .listen(config.app.port, ({ url }) =>
    console.log(`🦊 Application is running at ${url}`),
  );

export type App = typeof app;
