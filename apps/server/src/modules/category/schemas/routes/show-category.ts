import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';
import { Tag } from '@/modules/tag/schemas/tag';

export const ShowCategoryResponse = t.Composite([
  t.Pick(Category, ['id', 'label', 'isHidden']),
  t.Object({
    _count: t.Object({
      projects: t.Number(),
      tags: t.Number(),
    }),
  }),
]);
