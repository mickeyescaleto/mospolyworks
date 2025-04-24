import { t } from 'elysia';

export const UserRole = t.Union([
  t.Literal('student'),
  t.Literal('staff'),
  t.Literal('admin'),
]);

export type IUserRole = typeof UserRole.static;
