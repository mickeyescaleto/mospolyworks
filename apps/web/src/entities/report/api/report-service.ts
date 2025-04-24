import { server } from '@repo/server';

export class ReportService {
  static async getReports() {
    const { data, error } = await server.reports.index.get();

    if (error) {
      throw error;
    }

    return data;
  }

  static async createReport<
    T extends Parameters<typeof server.reports.index.post>[0],
  >(body: T) {
    const { data, error } = await server.reports.index.post(body);

    if (error) {
      throw error;
    }

    return data;
  }

  static async checkReport(id: string) {
    const { data, error } = await server.reports({ id }).check.post();

    if (error) {
      throw error;
    }

    return data;
  }
}
