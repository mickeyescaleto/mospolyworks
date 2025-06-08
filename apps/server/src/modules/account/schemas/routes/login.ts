import { t } from 'elysia';

import { Account } from '@/modules/account/schemas/account';
import { GetAccountResponse } from '@/modules/account/schemas/routes/get-account';

export const LoginBody = t.Pick(Account, ['login', 'password']);

export type ILoginBody = typeof LoginBody.static;

export const LoginResponse = GetAccountResponse;
