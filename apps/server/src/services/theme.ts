import { prisma } from '@repo/database';

export class ThemeService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async getExhibitionThemes() {
    const result = await this.prisma.theme.findMany({
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

    return result;
  }
}
