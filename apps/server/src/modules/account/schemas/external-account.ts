import { t } from 'elysia';

import { Account } from '@/modules/account/schemas/account';

export const ExternalAccount = t.Composite([
  t.Omit(Account, ['id', 'login', 'externalToken', 'createdAt', 'roles']),
  t.Object({
    user_status: t.String(),
  }),
]);

export const ExternalAccountCredentials = t.Object({
  login: t.String(),
  password: t.String(),
});

export type IExternalAccountCredentials =
  typeof ExternalAccountCredentials.static;

export const ParseAccountProps = t.Object({
  token: t.String(),
  user: t.Composite([
    ExternalAccount,
    t.Pick(ExternalAccountCredentials, ['login']),
  ]),
});

export type IParseAccountProps = typeof ParseAccountProps.static;
