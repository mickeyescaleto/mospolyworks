import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';

export const GetCategoryResponse = t.Pick(Category, ['id', 'label']);
