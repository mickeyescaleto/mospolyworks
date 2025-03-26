import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';

import { getLogger } from '@/utilities/logger';
import { SessionService } from '@/modules/session/session.service';
import { UserService } from '@/modules/user/user.service';
import { AccountService } from '@/modules/account/account.service';

const logger = getLogger('Scheduler');

export const scheduler = new Elysia()
  .use(
    cron({
      name: 'expired-sessions',
      pattern: '0 0 * * *',
      run: async () => {
        try {
          await SessionService.deleteExpiredSessions();

          const message = `Cron task 'expired-sessions' has been completed`;

          logger.info(message);
        } catch {
          logger.error(`Failed to complete the Cron task 'expired-sessions'`);
        }
      },
    }),
  )
  .use(
    cron({
      name: 'actualize-user-data',
      pattern: '0 0 * * *',
      run: async () => {
        const batchSize = 100;

        const totalUsers = await UserService.getCountUsers();

        for (let i = 0; i < totalUsers; i += batchSize) {
          const users = await UserService.getUsersBatch(i, batchSize);

          const results = await Promise.allSettled(
            users.map(async (user) => {
              const externalAccountData =
                await AccountService.actualizeAccountData(user.id);

              await UserService.updateUser(user.id, externalAccountData);
            }),
          );

          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              const message = `Failed to update user with ID ${users[index]?.id}`;

              logger.error(message);
            }
          });

          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        const message = `Cron task 'actualize-user-data' has been completed`;

        logger.info(message);
      },
    }),
  )
  .as('plugin');
