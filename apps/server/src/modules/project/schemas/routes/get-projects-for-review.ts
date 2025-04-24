import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';
import { User } from '@/modules/user/schemas/user';

export const GetProjectsForReviewQuery = t.Object({
  limit: t.Optional(t.Number({ minimum: 0 })),
  cursor: t.Optional(t.String()),
});

export type IGetProjectsForReviewQuery =
  typeof GetProjectsForReviewQuery.static;

export const GetProjectsForReviewResponse = t.Array(
  t.Composite([
    t.Pick(Project, ['id', 'cover', 'title', 'status', 'rejectionComment']),
    t.Object({
      author: t.Pick(User, ['id', 'name', 'surname', 'avatar']),
    }),
    t.Object({
      partners: t.Array(t.Pick(User, ['id', 'name', 'surname', 'avatar'])),
    }),
  ]),
);
