import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { cron } from '@elysiajs/cron';

import { config } from '@/config';
import { authentication } from '@/routes/authentication';
import { notifications } from '@/routes/notifications';
import { projects } from '@/routes/projects';
import { themes } from '@/routes/themes';
import { SessionService } from '@/services/session';

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(
    cron({
      name: 'verification',
      pattern: '0 0 * * *',
      run: async () => {
        await new SessionService().deleteExpiredSessions();
      },
    }),
  )
  .use(authentication)
  .use(notifications)
  .use(projects)
  .use(themes)
  .listen(config.app.port, ({ url }) =>
    console.log(`🦊 Application is running at ${url}`),
  );

export type App = typeof app;
