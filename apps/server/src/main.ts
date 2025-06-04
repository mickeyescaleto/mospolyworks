import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

import { config } from '@/config';
import { getLogger } from '@/utilities/logger';
import { serialization } from '@/plugins/serialization';
import { documentation } from '@/plugins/documentation';
import { scheduler } from '@/plugins/scheduler';
import { accounts } from '@/modules/account/account.routes';
import { notifications } from '@/modules/notification/notification.routes';
import { users } from '@/modules/user/user.routes';
import { categories } from '@/modules/category/category.routes';
import { tags } from '@/modules/tag/tag.routes';
import { projects } from '@/modules/project/project.routes';
import { likes } from '@/modules/like/like.routes';
import { reports } from '@/modules/report/report.routes';
import { storage } from '@/modules/storage/storage.routes';

const logger = getLogger('Application');

export const application = new Elysia()
  .use(cors())
  .use(serialization)
  .use(documentation)
  .use(scheduler)
  .use(accounts)
  .use(notifications)
  .use(users)
  .use(categories)
  .use(tags)
  .use(projects)
  .use(likes)
  .use(reports)
  .use(storage)
  .listen(config.app.port, ({ url }) => {
    logger.info(`Application is running at ${url}`);
  });

export type Application = typeof application;
