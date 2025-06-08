import { t } from 'elysia';

import { Account } from '@/modules/account/schemas/account';

export const GetAccountResponse = t.Omit(Account, ['login', 'password']);

export type IGetAccountResponse = typeof GetAccountResponse.static;
