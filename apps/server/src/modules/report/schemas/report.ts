import { t } from 'elysia';

export const Report = t.Object({
  id: t.String(),
  content: t.String(),
  isChecked: t.Boolean(),
  createdAt: t.Date(),
});
