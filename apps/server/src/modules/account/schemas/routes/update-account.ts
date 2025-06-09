import { t } from 'elysia';

import { Account } from '../account';
import { GetAccountResponse } from './get-account';

export const UpdateAccountBody = t.Composite([
  t.Pick(Account, ['name', 'surname']),
  t.Object({
    avatar: t.Union([t.Nullable(t.String()), t.File()]),
  }),
]);

export type IUpdateAccountBody = typeof UpdateAccountBody.static;

export const UpdateAccountResponse = GetAccountResponse;
