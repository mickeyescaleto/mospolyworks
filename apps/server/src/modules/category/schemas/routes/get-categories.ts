import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';

export const GetCategoriesResponse = t.Array(
  t.Composite([
    t.Pick(Category, ['id', 'label', 'isHidden']),
    t.Object({
      _count: t.Object({
        projects: t.Number(),
        tags: t.Number(),
      }),
    }),
  ]),
);
