import { t } from 'elysia';

import { Report } from '@/modules/report/schemas/report';
import { Project } from '@/modules/project/schemas/project';

export const GetReportsResponse = t.Array(
  t.Composite([
    t.Pick(Report, ['id', 'content', 'createdAt']),
    t.Object({
      project: t.Pick(Project, ['id', 'title']),
    }),
  ]),
);
