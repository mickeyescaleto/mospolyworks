import { t } from 'elysia';

import { Tag } from '@/modules/tag/schemas/tag';
import { Category } from '@/modules/category/schemas/category';

export const GetTagsResponse = t.Array(
  t.Composite([
    t.Pick(Tag, ['id', 'label']),
    t.Object({
      category: t.Pick(Category, ['id', 'label']),
    }),
  ]),
);
