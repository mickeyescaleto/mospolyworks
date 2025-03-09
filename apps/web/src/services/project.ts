import { server } from '@repo/server';

import type { GetExhibitionProjectsQuery } from '@/types/project';

export class ProjectService {
  private static readonly instance = server.projects;

  public static async getExhibitionProjects({
    search,
    theme,
    sort,
  }: GetExhibitionProjectsQuery) {
    const query: Record<string, string> = {};

    if (search) {
      query.search = search;
    }

    if (theme) {
      query.theme = theme;
    }

    if (sort) {
      query.sort = sort;
    }

    const { data, error } = await this.instance.exhibition.get({
      query,
    });

    if (error) {
      throw error;
    }

    return data;
  }
}
