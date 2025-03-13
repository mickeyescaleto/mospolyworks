import { t } from 'elysia';

import { tUser } from '@/modules/user/schemas/user';

export const tGetProfileResponse = t.Omit(tUser, [
  'login',
  'password',
  'externalToken',
  'updatedAt',
]);
