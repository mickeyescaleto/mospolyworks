import { t } from 'elysia';

import { tRole } from '@/modules/user/schemas/role';

export const tPayload = t.Object({
  id: t.String(),
  roles: t.Array(tRole),
});
