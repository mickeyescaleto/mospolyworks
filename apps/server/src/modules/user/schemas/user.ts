import { t } from 'elysia';

import { UserRole } from '@/modules/user/schemas/user-role';

export const User = t.Object({
  id: t.String(),
  name: t.String(),
  surname: t.String(),
  avatar: t.String(),
  login: t.String(),
  password: t.String(),
  createdAt: t.Date(),
  roles: t.Array(UserRole),
});
