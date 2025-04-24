import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { ReportService } from '@/modules/report/report.service';
import {
  CreateReportBody,
  CreateReportResponse,
} from '@/modules/report/schemas/routes/create-report';
import { GetReportsResponse } from '@/modules/report/schemas/routes/get-reports';
import { CheckReportResponse } from '@/modules/report/schemas/routes/check-report';

const logger = getLogger('Reports');

export const reports = new Elysia({
  prefix: '/reports',
  tags: ['Жалобы'],
})
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const report = await ReportService.createReport(body);

        const message = `Report with the ID ${report.id} has been successfully created`;

        logger.info(message);

        return report;
      } catch {
        const message = 'An error occurred when creating the report';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      body: CreateReportBody,
      response: response(CreateReportResponse),
      detail: {
        summary: 'Создать новую жалобу',
        description: 'Создаёт новую жалобу и возвращает информацию о ней',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/',
        async ({ set }) => {
          try {
            const reports = await ReportService.getReports();

            const message = `Reports have been successfully received`;

            logger.info(message);

            return reports;
          } catch {
            const message = 'An error occurred when receiving reports';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(GetReportsResponse),
          detail: {
            summary: 'Получить все жалобы',
            description: 'Возвращает список с информацией о жалобах',
          },
        },
      )
      .post(
        '/:id/check',
        async ({ params, set }) => {
          try {
            const report = await ReportService.checkReport(params.id);

            const message = `Report with the ID ${report.id} has been successfully checked`;

            logger.info(message);

            return report;
          } catch {
            const message = 'An error occurred when ckecking the report';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(CheckReportResponse),
          detail: {
            summary: 'Проверить жалобу',
            description: 'Отмечает жалобу как проверенную по её идентификатору',
          },
        },
      ),
  );
