import { t } from 'elysia';

export const Session = t.Object({
  id: t.String(),
  token: t.String(),
  expiresAt: t.Date(),
  createdAt: t.Date(),
});
