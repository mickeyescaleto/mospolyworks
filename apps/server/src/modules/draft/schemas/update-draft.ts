import { t } from 'elysia';

import { tDraft } from '@/modules/draft/schemas/draft';
import { tUser } from '@/modules/user/schemas/user';
import { tCategory } from '@/modules/category/schemas/category';
import { tTag } from '@/modules/tag/schemas/tag';

export const tUpdateDraftParams = t.Object({
  draftId: t.String(),
});

export const tUpdateDraftBody = t.Composite([
  t.Omit(tDraft, ['id', 'createdAt']),
  t.Object({
    categoryId: t.Nullable(t.String()),
  }),
  t.Object({
    draftPartners: t.Array(t.String()),
  }),
  t.Object({
    draftTags: t.Array(t.String()),
  }),
]);

export type UpdateDraftBody = typeof tUpdateDraftBody.static;

export const tUpdateDraftResponse = t.Composite([
  tDraft,
  t.Object({
    author: t.Pick(tUser, ['id', 'name', 'surname', 'avatar']),
  }),
  t.Object({
    draftPartners: t.Array(
      t.Object({
        user: t.Pick(tUser, ['id', 'name', 'surname', 'avatar']),
      }),
    ),
  }),
  t.Object({
    category: t.Nullable(t.Pick(tCategory, ['id', 'title'])),
  }),
  t.Object({
    draftTags: t.Array(
      t.Object({
        tag: t.Pick(tTag, ['id', 'title']),
      }),
    ),
  }),
]);
