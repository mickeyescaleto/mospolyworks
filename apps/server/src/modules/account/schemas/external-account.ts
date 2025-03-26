import { t } from 'elysia';

import { tAccount } from '@/modules/account/schemas/account';

export const tExternalAccount = t.Composite([
  t.Omit(tAccount, ['id', 'roles', 'login', 'externalToken']),
  t.Object({
    user_status: t.String(),
  }),
]);

export type ExternalAccount = typeof tExternalAccount.static;

export const tExternalAccountBody = t.Object({
  login: t.String(),
  password: t.String(),
});

export type ExternalAccountBody = typeof tExternalAccountBody.static;
