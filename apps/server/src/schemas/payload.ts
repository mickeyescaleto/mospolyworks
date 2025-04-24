import { t } from 'elysia';

import { UserRole } from '@/modules/user/schemas/user-role';

export const Payload = t.Object({
  id: t.String(),
  roles: t.Array(UserRole),
});

export type IPayload = typeof Payload.static;
