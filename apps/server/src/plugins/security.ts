import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { account } from '@/plugins/account';
import { Cookie } from '@/schemas/cookie';
import { type IUserRole } from '@/modules/user/schemas/user-role';

const logger = getLogger('Security');

type UseRolesProps = {
  roles: IUserRole[];
  type?: 'some' | 'every';
};

export const security = new Elysia()
  .use(account)
  .guard({
    cookie: Cookie,
    detail: { security: [{ AccessToken: [] }, { RefreshToken: [] }] },
  })
  .resolve(({ account, cookie, set }) => {
    if (!account) {
      cookie['access_token'].remove();
      cookie['refresh_token'].remove();

      const message = 'Unauthorized';

      logger.warn(message);

      set.status = 401;
      throw new Error(message);
    }

    return { account };
  })
  .macro({
    useRoles: ({ roles, type = 'some' }: UseRolesProps) => ({
      beforeHandle: ({ account, set }) => {
        if (!roles[type]((role) => account?.roles.includes(role))) {
          const message = 'Access is denied due to insufficient permissions';

          logger.warn(message);

          set.status = 403;
          throw new Error(message);
        }
      },
    }),
  })
  .as('plugin');
