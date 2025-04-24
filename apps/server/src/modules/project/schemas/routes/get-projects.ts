import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';
import { User } from '@/modules/user/schemas/user';

export const GetProjectsQuery = t.Object({
  limit: t.Optional(t.Number({ minimum: 0 })),
  cursor: t.Optional(t.String()),
});

export type IGetProjectsQuery = typeof GetProjectsQuery.static;

export const GetProjectsResponse = t.Array(
  t.Composite([
    t.Pick(Project, ['id', 'cover', 'title', 'status']),
    t.Object({
      author: t.Pick(User, ['id', 'name', 'surname', 'avatar']),
    }),
    t.Object({
      partners: t.Array(t.Pick(User, ['id', 'name', 'surname', 'avatar'])),
    }),
    t.Object({
      _count: t.Object({
        likes: t.Number(),
      }),
    }),
  ]),
);
