import * as z from 'zod';

import { AuthService } from '@/services/auth';
import { userAuthSchema } from '@/schemas/user-auth';

export type User = Awaited<ReturnType<typeof AuthService.getProfile>>;

export type UserLoginCredentials = z.infer<typeof userAuthSchema>;
