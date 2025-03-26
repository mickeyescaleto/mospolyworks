import { t } from 'elysia';

export const tStatus = t.Union([
  t.Literal('PUBLISHED'),
  t.Literal('REJECTED'),
  t.Literal('REPEATED'),
  t.Literal('VERIFIED'),
]);
