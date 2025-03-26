import { t } from 'elysia';

export const tDraft = t.Object({
  id: t.String(),
  title: t.Nullable(t.String()),
  content: t.Array(t.Any()),
  image: t.Nullable(t.String()),
  link: t.Nullable(t.String()),
  createdAt: t.Date(),
});
