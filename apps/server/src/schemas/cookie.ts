import { t } from 'elysia';

export const tCookie = t.Cookie(
  {
    atoken: t.Optional(t.String()),
    rtoken: t.Optional(t.String()),
  },
  {
    secure: true,
    httpOnly: true,
  },
);
