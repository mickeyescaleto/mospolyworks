import { t } from 'elysia';

export const Tag = t.Object({
  id: t.String(),
  label: t.String(),
  createdAt: t.Date(),
});
