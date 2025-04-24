import { prisma } from '@repo/database';

import { type ICreateReportBody } from '@/modules/report/schemas/routes/create-report';

export class ReportService {
  static async getReports() {
    return await prisma.report.findMany({
      where: {
        isChecked: false,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async createReport(data: ICreateReportBody) {
    return await prisma.report.create({
      data: {
        content: data.content,
        project: {
          connect: {
            id: data.projectId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  static async checkReport(id: string) {
    return await prisma.report.update({
      where: {
        id,
      },
      data: {
        isChecked: true,
      },
      select: {
        id: true,
      },
    });
  }
}
