import { t } from 'elysia';

import { tUser } from '@/modules/user/schemas/user';

export const tAccount = tUser;

export const tAccountResponse = t.Omit(tAccount, ['login', 'externalToken']);
