import { t } from 'elysia';

export const tLike = t.Object({
  id: t.String(),
  hash: t.Nullable(t.String()),
  createdAt: t.Date(),
});
