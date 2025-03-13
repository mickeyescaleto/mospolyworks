import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

import { config } from '@/config';
import { documentation } from '@/plugins/documentation';
import { scheduler } from '@/plugins/scheduler';
import { auth } from '@/modules/auth/auth.routes';
import { notifications } from '@/modules/notification/notification.routes';
import { projects } from '@/modules/project/project.routes';
import { themes } from '@/modules/theme/theme.routes';
import { users } from '@/modules/user/user.routes';

const application = new Elysia()
  .use(cors())
  .use(documentation)
  .use(scheduler)
  .use(auth)
  .use(notifications)
  .use(projects)
  .use(themes)
  .use(users)
  .listen(config.app.port, ({ url }) =>
    console.log(`Application is running at ${url}`),
  );

export type App = typeof application;
