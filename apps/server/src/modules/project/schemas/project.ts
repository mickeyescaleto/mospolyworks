import { t } from 'elysia';

import { TitleAlignment } from '@/modules/project/schemas/title-alignment';
import { ProjectStatus } from '@/modules/project/schemas/project-status';

export const Project = t.Object({
  id: t.String(),
  cover: t.Nullable(t.String()),
  title: t.Nullable(t.String()),
  titleAlignment: TitleAlignment,
  content: t.Nullable(t.Any()),
  link: t.Nullable(t.String()),
  rejectionComment: t.Nullable(t.String()),
  publishedAt: t.Nullable(t.Date()),
  status: ProjectStatus,
  views: t.Number(),
  createdAt: t.Date(),
});
