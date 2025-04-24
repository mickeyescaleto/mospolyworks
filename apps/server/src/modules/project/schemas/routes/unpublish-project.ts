import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';
import { User } from '@/modules/user/schemas/user';
import { Category } from '@/modules/category/schemas/category';
import { Tag } from '@/modules/tag/schemas/tag';

export const UnpublishProjectResponse = t.Composite([
  Project,
  t.Object({
    author: t.Pick(User, ['id', 'name', 'surname', 'avatar']),
  }),
  t.Object({
    partners: t.Array(t.Pick(User, ['id', 'name', 'surname', 'avatar'])),
  }),
  t.Object({
    category: t.Nullable(t.Pick(Category, ['id', 'label'])),
  }),
  t.Object({
    tags: t.Array(t.Pick(Tag, ['id', 'label'])),
  }),
]);
