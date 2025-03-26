import { NotFoundError } from 'elysia';

import { Prisma, prisma } from '@repo/database';

import { type GetExhibitionProjectsQuery } from '@/modules/project/schemas/get-exhibition-projects';

export abstract class ProjectService {
  static async getProject(projectId: string) {
    const project = await prisma.project.update({
      where: {
        id: projectId,
        status: {
          in: ['PUBLISHED', 'VERIFIED'],
        },
      },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        link: true,
        status: true,
        rejectionComment: true,
        views: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        projectPartners: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with the ID ${projectId} was not found`);
    }

    return project;
  }

  static async getExhibitionProjects({
    search,
    category,
    tag,
    sort = 'date',
    limit,
    cursor,
  }: GetExhibitionProjectsQuery) {
    limit = limit && limit < 0 ? undefined : limit;

    const where: Prisma.ProjectWhereInput = {
      status: {
        in: ['PUBLISHED', 'VERIFIED'],
      },
    };

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = [];

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (category) {
      where.category = {
        id: category,
      };
    }

    if (tag) {
      where.projectTags = {
        some: {
          tag: {
            id: tag,
          },
        },
      };
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
    }

    const result = await prisma.project.findMany({
      where,
      orderBy,
      take: limit || undefined,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        title: true,
        image: true,
        status: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        projectPartners: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
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
