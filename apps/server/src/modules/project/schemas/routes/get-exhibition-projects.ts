import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';
import { User } from '@/modules/user/schemas/user';

const GetExhibitionProjectsQuerySort = t.Union([
  t.Literal('date'),
  t.Literal('rating'),
  t.Literal('verified'),
]);

export const GetExhibitionProjectsQuery = t.Object({
  search: t.Optional(t.String()),
  sort: t.Optional(GetExhibitionProjectsQuerySort),
  category: t.Optional(t.String()),
  tag: t.Optional(t.String()),
  author: t.Optional(t.String()),
  contributor: t.Optional(t.String()),
  limit: t.Optional(t.Number({ minimum: 0 })),
  cursor: t.Optional(t.String()),
});

export type IGetExhibitionProjectsQuery =
  typeof GetExhibitionProjectsQuery.static;

export const GetExhibitionProjectsResponse = t.Array(
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
