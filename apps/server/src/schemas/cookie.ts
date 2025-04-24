import { t } from 'elysia';

export const Cookie = t.Cookie(
  {
    access_token: t.Optional(t.String()),
    refresh_token: t.Optional(t.String()),
    client: t.Optional(t.String()),
  },
  {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  },
);
