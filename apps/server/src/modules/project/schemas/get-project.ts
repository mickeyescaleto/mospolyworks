import { t } from 'elysia';

import { tProject } from '@/modules/project/schemas/project';
import { tUser } from '@/modules/user/schemas/user';

export const tGetProjectParams = t.Object({
  projectId: t.String(),
});

export const tGetProjectResponse = t.Composite([
  tProject,
  t.Object({
    author: t.Pick(tUser, ['id', 'name', 'surname', 'avatar']),
  }),
  t.Object({
    projectPartners: t.Array(
      t.Object({
        user: t.Pick(tUser, ['id', 'name', 'surname', 'avatar']),
      }),
    ),
  }),
  t.Object({
    _count: t.Object({
      likes: t.Number(),
    }),
  }),
]);
