import { prisma } from '@repo/database';

export abstract class ThemeService {
  static async getExhibitionThemes() {
    return await prisma.theme.findMany({
      where: {
        isHidden: false,
        projects: { some: {} },
      },
      select: {
        id: true,
        title: true,
        tags: {
          where: { taggedProjects: { some: {} } },
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
}
