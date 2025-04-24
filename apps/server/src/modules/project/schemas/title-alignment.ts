import { t } from 'elysia';

export const TitleAlignment = t.Union([
  t.Literal('left'),
  t.Literal('center'),
  t.Literal('right'),
  t.Literal('justify'),
]);
