import { t } from 'elysia';

import { Category } from '@/modules/category/schemas/category';

export const DeleteCategoryResponse = t.Pick(Category, ['id']);
