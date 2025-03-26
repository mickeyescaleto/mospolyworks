import { t } from 'elysia';

export const tCategory = t.Object({
  id: t.String(),
  title: t.String(),
  isHidden: t.Boolean(),
});
