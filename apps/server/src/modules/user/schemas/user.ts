import { t } from 'elysia';

import { tRole } from '@/modules/user/schemas/role';

export const tUser = t.Object({
  id: t.String(),
  name: t.String(),
  surname: t.String(),
  patronymic: t.String(),
  avatar: t.String(),
  roles: t.Array(tRole),
  login: t.String(),
  group: t.String(),
  course: t.String(),
  faculty: t.String(),
  specialty: t.String(),
  specialization: t.String(),
  externalToken: t.String(),
});
