import { t } from 'elysia';

import { tProject } from '@/modules/project/schemas/project';
import { tUser } from '@/modules/user/schemas/user';

export const tGetExhibitionProjectsQuery = t.Object({
  search: t.Optional(t.String()),
  category: t.Optional(t.String()),
  tag: t.Optional(t.String()),
  sort: t.Optional(
    t.Union([t.Literal('date'), t.Literal('rating'), t.Literal('verified')]),
  ),
  limit: t.Optional(t.Number()),
  cursor: t.Optional(t.String()),
});

export type GetExhibitionProjectsQuery =
  typeof tGetExhibitionProjectsQuery.static;

export const tGetExhibitionProjectsResponse = t.Array(
  t.Composite([
    t.Pick(tProject, ['id', 'title', 'image', 'status']),
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
  ]),
);
