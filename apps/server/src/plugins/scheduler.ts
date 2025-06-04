import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';

import { SessionService } from '@/modules/session/session.service';

export const scheduler = new Elysia()
  .use(
    cron({
      name: 'expired-sessions',
      pattern: '0 0 * * *',
      run: async () => {
        await SessionService.deleteExpiredSessions();
      },
    }),
  )
  .as('plugin');
