import { t } from 'elysia';

import { Account } from '@/modules/account/schemas/account';
import { GetAccountResponse } from '@/modules/account/schemas/routes/get-account';

export const RegisterBody = t.Pick(Account, [
  'name',
  'surname',
  'login',
  'email',
  'password',
]);

export type IRegisterBody = typeof RegisterBody.static;

export const RegisterResponse = GetAccountResponse;
