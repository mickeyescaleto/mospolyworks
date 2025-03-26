import { t } from 'elysia';

import { tTag } from '@/modules/tag/schemas/tag';
import { tCategory } from '@/modules/category/schemas/category';

export const tGetTagParams = t.Object({
  tagId: t.String(),
});

export const tGetTagResponse = t.Composite([
  tTag,
  t.Object({
    category: t.Pick(tCategory, ['id', 'title']),
  }),
]);
