import { t } from 'elysia';

import { tStatus } from '@/modules/project/schemas/status';

export const tProject = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.Array(t.Any()),
  image: t.String(),
  link: t.Nullable(t.String()),
  status: tStatus,
  rejectionComment: t.Nullable(t.String()),
  views: t.Number(),
  createdAt: t.Date(),
});
