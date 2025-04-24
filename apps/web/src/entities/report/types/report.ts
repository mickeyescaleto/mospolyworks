import { ReportService } from '@/entities/report/api/report-service';

export type Report = Awaited<
  ReturnType<typeof ReportService.getReports>
>[number];
