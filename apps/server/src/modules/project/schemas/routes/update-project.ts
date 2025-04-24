import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';
import { User } from '@/modules/user/schemas/user';
import { Category } from '@/modules/category/schemas/category';
import { Tag } from '@/modules/tag/schemas/tag';

export const UpdateProjectBody = t.Composite([
  t.Omit(Project, [
    'id',
    'cover',
    'content',
    'rejectionComment',
    'isPublished',
    'publishedAt',
    'type',
    'status',
    'views',
    'createdAt',
  ]),
  t.Object({
    cover: t.Union([t.Nullable(t.String()), t.File()]),
  }),
  t.Object({
    content: t.Nullable(t.String()),
  }),
  t.Object({
    categoryId: t.Nullable(t.String()),
  }),
  t.Object({
    partners: t.Nullable(t.String()),
  }),
  t.Object({
    tags: t.Nullable(t.String()),
  }),
]);

export type IUpdateProjectBody = typeof UpdateProjectBody.static;

export const UpdateProjectResponse = t.Composite([
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
