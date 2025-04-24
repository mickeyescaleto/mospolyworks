import { t } from 'elysia';

import { User } from '@/modules/user/schemas/user';

export const GetUserResponse = t.Omit(User, ['login', 'externalToken']);
