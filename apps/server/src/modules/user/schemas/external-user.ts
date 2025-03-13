import { t } from 'elysia';

import { tUser } from '@/modules/user/schemas/user';

export const tExternalUser = t.Composite([
  t.Omit(tUser, [
    'id',
    'roles',
    'login',
    'password',
    'externalToken',
    'updatedAt',
  ]),
  t.Object({
    user_status: t.String(),
  }),
]);

export const tExternalUserCredentials = t.Pick(tUser, ['login', 'password']);
