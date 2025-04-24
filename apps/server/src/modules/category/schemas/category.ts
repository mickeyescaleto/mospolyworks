import { t } from 'elysia';

export const Category = t.Object({
  id: t.String(),
  label: t.String(),
  isHidden: t.Boolean(),
  createdAt: t.Date(),
});
