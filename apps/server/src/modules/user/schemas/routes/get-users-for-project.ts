import { t } from 'elysia';

import { User } from '@/modules/user/schemas/user';

export const GetUsersForProjectResponse = t.Array(
  t.Pick(User, ['id', 'name', 'surname', 'avatar']),
);
