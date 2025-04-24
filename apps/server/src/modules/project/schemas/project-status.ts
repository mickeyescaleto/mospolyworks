import { t } from 'elysia';

export const ProjectStatus = t.Union([
  t.Literal('unpublished'),
  t.Literal('published'),
  t.Literal('verified'),
  t.Literal('rejected'),
  t.Literal('corrected'),
]);
