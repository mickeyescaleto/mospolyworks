import { t } from 'elysia';

export const tCookie = t.Cookie(
  {
    access_token: t.Optional(t.String()),
    refresh_token: t.Optional(t.String()),
    user_hash: t.Optional(t.String()),
  },
  {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  },
);
