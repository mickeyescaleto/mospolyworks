import { t } from 'elysia';

import { tCategory } from '@/modules/category/schemas/category';
import { tTag } from '@/modules/tag/schemas/tag';

export const tGetExhibitionCategoriesResponse = t.Array(
  t.Composite([
    t.Pick(tCategory, ['id', 'title']),
    t.Object({
      tags: t.Array(t.Pick(tTag, ['id', 'title'])),
    }),
  ]),
);
