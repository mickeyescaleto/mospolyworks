import { t } from 'elysia';

import { tCategory } from '@/modules/category/schemas/category';

export const tGetCategoryParams = t.Object({
  categoryId: t.String(),
});

export const tGetCategoryResponse = t.Pick(tCategory, ['id', 'title']);
