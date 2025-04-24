import { t } from 'elysia';

export const Notification = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  link: t.Nullable(t.String()),
  isRead: t.Boolean(),
  createdAt: t.Date(),
});
