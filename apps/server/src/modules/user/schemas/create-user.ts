import { t } from 'elysia';

import { tUser } from '@/modules/user/schemas/user';

export const tCreateUserBody = t.Omit(tUser, ['id']);

export type CreateUserBody = typeof tCreateUserBody.static;
