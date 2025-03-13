import { t } from 'elysia';

export const tNotification = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  link: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
});
