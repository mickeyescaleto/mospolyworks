import { Prisma, prisma } from '@repo/database';

import type { GetExhibitionProjects } from '@/types/project';

export class ProjectService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async getExhibitionProjects({ search, theme, sort }: GetExhibitionProjects) {
    const where: Prisma.ProjectWhereInput = {
      status: { in: ['PUBLISHED', 'VERIFIED'] },
    };

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = [];

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (theme) {
      const existingTheme = await this.prisma.theme.findUnique({
        where: { title: theme },
      });

      if (existingTheme) {
        where.theme = { title: { equals: theme } };
      }
    }

    switch (sort) {
      case 'date':
        orderBy.push({ createdAt: 'desc' });
        break;
      case 'rating':
        orderBy.push({ likes: { _count: 'desc' } });
        orderBy.push({ createdAt: 'desc' });
        break;
      case 'verified':
        where.status = { equals: 'VERIFIED' };
        orderBy.push({ createdAt: 'desc' });
        break;
      default:
        orderBy.push({ createdAt: 'desc' });
        break;
    }

    const result = await this.prisma.project.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        image: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
        projectPartners: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
        },
        status: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return result;
  }
}
