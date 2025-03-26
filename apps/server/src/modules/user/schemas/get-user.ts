import { t } from 'elysia';

import { tUser } from '@/modules/user/schemas/user';

export const tGetUserParams = t.Object({
  userId: t.String(),
});

export const tGetUserResponse = tUser;
