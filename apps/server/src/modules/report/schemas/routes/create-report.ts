import { t } from 'elysia';

import { Report } from '@/modules/report/schemas/report';

export const CreateReportBody = t.Composite([
  t.Pick(Report, ['content']),
  t.Object({
    projectId: t.String(),
  }),
]);

export type ICreateReportBody = typeof CreateReportBody.static;

export const CreateReportResponse = t.Pick(Report, ['id']);
