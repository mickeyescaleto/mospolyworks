import { t } from 'elysia';

export const UserRole = t.Union([t.Literal('user'), t.Literal('admin')]);

export type IUserRole = typeof UserRole.static;
