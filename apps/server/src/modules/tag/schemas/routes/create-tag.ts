import { t } from 'elysia';

import { Tag } from '@/modules/tag/schemas/tag';
import { Category } from '@/modules/category/schemas/category';

export const CreateTagBody = t.Composite([
  t.Pick(Tag, ['label']),
  t.Object({
    categoryId: t.String(),
  }),
]);

export type ICreateTagBody = typeof CreateTagBody.static;

export const CreateTagResponse = t.Composite([
  t.Pick(Tag, ['id', 'label']),
  t.Object({
    category: t.Pick(Category, ['id', 'label']),
  }),
]);
