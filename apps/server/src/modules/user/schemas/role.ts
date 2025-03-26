import { t } from 'elysia';

export const tRole = t.Union([
  t.Literal('STUDENT'),
  t.Literal('STAFF'),
  t.Literal('ADMIN'),
]);

export type Role = typeof tRole.static;
