import { t } from 'elysia';

import { UserRole } from '@/modules/user/schemas/user-role';

export const User = t.Object({
  id: t.String(),
  name: t.String(),
  surname: t.String(),
  patronymic: t.String(),
  avatar: t.String(),
  login: t.String(),
  group: t.String(),
  course: t.String(),
  faculty: t.String(),
  specialty: t.String(),
  specialization: t.String(),
  externalToken: t.String(),
  createdAt: t.Date(),
  roles: t.Array(UserRole),
});
