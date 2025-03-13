import { t } from 'elysia';

import { tStatus } from '@/modules/project/schemas/status';

export const tProject = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  image: t.String(),
  link: t.MaybeEmpty(t.String()),
  status: tStatus,
  rejectionComment: t.MaybeEmpty(t.String()),
  updatedAt: t.Date(),
  createdAt: t.Date(),
});
