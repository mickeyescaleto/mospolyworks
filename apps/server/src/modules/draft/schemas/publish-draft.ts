import { t } from 'elysia';

import { tProject } from '@/modules/project/schemas/project';
import { tUser } from '@/modules/user/schemas/user';
import { tCategory } from '@/modules/category/schemas/category';
import { tTag } from '@/modules/tag/schemas/tag';

export const tPublishDraftParams = t.Object({
  draftId: t.String(),
});

export const tPublishDraftResponse = t.Composite([
  t.Pick(tProject, [
    'id',
    'title',
    'content',
    'image',
    'link',
    'status',
    'rejectionComment',
    'views',
    'createdAt',
  ]),
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
    category: t.Pick(tCategory, ['id', 'title']),
  }),
  t.Object({
    projectTags: t.Array(
      t.Object({
        tag: t.Pick(tTag, ['id', 'title']),
      }),
    ),
  }),
  t.Object({
    _count: t.Object({
      likes: t.Number(),
    }),
  }),
]);
