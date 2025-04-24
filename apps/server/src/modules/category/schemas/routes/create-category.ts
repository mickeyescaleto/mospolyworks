import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';

export const CreateCategoryBody = t.Pick(Category, ['label']);

export type ICreateCategoryBody = typeof CreateCategoryBody.static;

export const CreateCategoryResponse = t.Composite([
  t.Pick(Category, ['id', 'label', 'isHidden']),
  t.Object({
    _count: t.Object({
      projects: t.Number(),
      tags: t.Number(),
    }),
  }),
]);
