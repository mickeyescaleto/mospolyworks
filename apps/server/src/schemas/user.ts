import { t } from 'elysia';
import { tRole } from '@/schemas/role';

export const tExternalUserData = t.Object({
  name: t.String(),
  surname: t.String(),
  patronymic: t.String(),
  avatar: t.String(),
  group: t.String(),
  course: t.String(),
  faculty: t.String(),
  specialty: t.String(),
  specialization: t.String(),
  user_status: t.String(),
});

export const tUser = t.Object({
  id: t.String(),
  name: t.String(),
  surname: t.String(),
  patronymic: t.String(),
  avatar: t.String(),
  roles: t.Array(tRole),
  login: t.String(),
  password: t.String(),
  group: t.String(),
  course: t.String(),
  faculty: t.String(),
  specialty: t.String(),
  specialization: t.String(),
  externalToken: t.String(),
  updatedAt: t.Date(),
});

export const tUserResponse = t.Omit(tUser, [
  'login',
  'password',
  'externalToken',
  'updatedAt',
]);

export const tUserLoginCredentials = t.Pick(tUser, ['login', 'password']);
