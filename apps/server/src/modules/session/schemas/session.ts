import { t } from 'elysia';

export const tSession = t.Object({
  id: t.String(),
  token: t.String(),
  expiresAt: t.Date(),
});
