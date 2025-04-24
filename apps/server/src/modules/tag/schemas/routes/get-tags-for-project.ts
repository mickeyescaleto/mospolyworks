import { t } from 'elysia';

import { Tag } from '@/modules/tag/schemas/tag';

export const GetTagsForProjectQuery = t.Object({
  categoryId: t.String(),
});

export type IGetTagsForProjectQuery = typeof GetTagsForProjectQuery.static;

export const GetTagsForProjectResponse = t.Array(t.Pick(Tag, ['id', 'label']));
