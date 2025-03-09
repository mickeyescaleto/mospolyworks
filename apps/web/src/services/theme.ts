import { server } from '@repo/server';

export class ThemeService {
  private static readonly instance = server.themes;

  public static async getExhibitionThemes() {
    const { data, error } = await this.instance.exhibition.get();

    if (error) {
      throw error;
    }

    return data;
  }
}
