import { t } from 'elysia';

import { Report } from '@/modules/report/schemas/report';

export const CheckReportResponse = t.Pick(Report, ['id']);
