import { t } from 'elysia';

export const tReport = t.Object({
  id: t.String(),
  content: t.String(),
  isChecked: t.Boolean(),
  createdAt: t.Date(),
});
