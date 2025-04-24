import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';

export const GetCategoriesForProjectResponse = t.Array(
  t.Pick(Category, ['id', 'label']),
);
