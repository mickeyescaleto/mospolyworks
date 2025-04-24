import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';
import { Tag } from '@/modules/tag/schemas/tag';

export const GetExhibitionCategoriesQuery = t.Object({
  user: t.Optional(t.String()),
});

export type IGetExhibitionCategoriesQuery =
  typeof GetExhibitionCategoriesQuery.static;

export const GetExhibitionCategoriesResponse = t.Array(
  t.Composite([
    t.Pick(Category, ['id', 'label']),
    t.Object({
      tags: t.Array(t.Pick(Tag, ['id', 'label'])),
    }),
  ]),
);
