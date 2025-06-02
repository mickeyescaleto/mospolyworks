import { NotFoundError } from 'elysia';

import { Prisma, prisma } from '@repo/database';

import { BadRequestError } from '@/errors/bad-request';
import { StorageService } from '@/modules/storage/storage.service';
import { type IGetExhibitionProjectsQuery } from '@/modules/project/schemas/routes/get-exhibition-projects';
import { type IUpdateProjectBody } from '@/modules/project/schemas/routes/update-project';
import { type IGetProjectsQuery } from '@/modules/project/schemas/routes/get-projects';
import { type IGetProjectsForReviewQuery } from '@/modules/project/schemas/routes/get-projects-for-review';
import { type IRejectProjectBody } from '@/modules/project/schemas/routes/reject-project';

export class ProjectService {
  static async getExhibitionProjects({
    search,
    sort = 'date',
    category,
    tag,
    author,
    contributor,
    limit,
    cursor,
  }: IGetExhibitionProjectsQuery) {
    const where: Prisma.ProjectWhereInput = {
      status: {
        in: ['published', 'verified'],
      },
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(category && {
        category: {
          id: category,
        },
      }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              id: tag,
            },
          },
        },
      }),
      ...(author && {
        author: {
          id: author,
        },
      }),
      ...(contributor && {
        partners: {
          some: {
            partner: {
              id: contributor,
            },
          },
        },
      }),
    };

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = [];

    switch (sort) {
      case 'date':
        orderBy.push({ publishedAt: 'desc' });
        break;
      case 'rating':
        orderBy.push({ likes: { _count: 'desc' } });
        orderBy.push({ publishedAt: 'desc' });
        break;
      case 'verified':
        where.status = { equals: 'verified' };
        orderBy.push({ publishedAt: 'desc' });
        break;
    }

    return await prisma.project.findMany({
      where,
      orderBy,
      take: limit || undefined,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        cover: true,
        title: true,
        status: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        partners: {
          select: {
            partner: {
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
  }

  static async getExhibitionProjectById(id: string) {
    return await prisma.project.update({
      data: {
        views: {
          increment: 1,
        },
      },
      where: {
        id,
        status: {
          in: ['published', 'verified'],
        },
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
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
  }

  static async getProjectForReview(id: string) {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        rejectionComment: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with the ID ${id} was not found`);
    }

    return project;
  }

  static async getProjectById(projectId: string, authorId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        author: {
          id: authorId,
        },
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        rejectionComment: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
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

  static async getProjectLike(
    id: string,
    { client, account }: { client: string; account?: string },
  ) {
    const project = await prisma.project.findFirst({
      where: {
        id,
      },
      select: {
        likes: {
          where: {
            ...(account
              ? {
                  user: {
                    id: account,
                  },
                }
              : {
                  client,
                }),
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with the ID ${id} was not found`);
    }

    return project;
  }

  static async getUnpublishedProjects({
    userId,
    limit,
    cursor,
  }: IGetProjectsQuery & { userId: string }) {
    return await prisma.project.findMany({
      where: {
        status: {
          in: ['unpublished', 'rejected', 'corrected'],
        },
        author: {
          id: userId,
        },
      },
      take: limit || undefined,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        cover: true,
        title: true,
        status: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        partners: {
          select: {
            partner: {
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
  }

  static async createProject(authorId: string) {
    return await prisma.project.create({
      data: {
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  static async publishProject(id: string, authorId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id,
        author: {
          id: authorId,
        },
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with the ID ${id} was not found`);
    }

    if (['published', 'verified', 'corrected'].includes(project.status)) {
      throw new BadRequestError(
        `Project with ID ${id} has already been published`,
      );
    }

    if (
      !project.title ||
      !project.cover ||
      !project.categoryId ||
      !project.content ||
      project.content.length === 0
    ) {
      throw new BadRequestError(`Project with ID ${id} cannot be published`);
    }

    return await prisma.project.update({
      where: {
        id,
      },
      data: {
        status: project.status === 'rejected' ? 'corrected' : 'published',
        publishedAt: !project.publishedAt ? new Date() : undefined,
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        rejectionComment: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
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
  }

  static async unpublishProject(id: string, authorId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id,
        author: {
          id: authorId,
        },
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with the ID ${id} was not found`);
    }

    if (['unpublished', 'rejected'].includes(project.status)) {
      throw new BadRequestError(
        `Project with ID ${id} has already been unpublished`,
      );
    }

    return await prisma.project.update({
      where: {
        id,
      },
      data: {
        status: project.status === 'corrected' ? 'rejected' : 'unpublished',
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        rejectionComment: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
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
  }

  static async updateProject(
    id: string,
    authorId: string,
    data: IUpdateProjectBody,
  ) {
    const project = await prisma.project.findUnique({
      where: {
        id,
        author: {
          id: authorId,
        },
      },
    });

    if (!project) {
      throw new Error(`Project with ID ${id} was not found`);
    }

    const content = data.content ? JSON.parse(data.content) : [];
    const partners = data.partners ? JSON.parse(data.partners) : [];
    const tags = data.tags ? JSON.parse(data.tags) : [];
    const cover =
      data.cover instanceof File
        ? await StorageService.save(data.cover)
        : (data.cover as string);

    const { categoryId, link, title, titleAlignment } = data;

    return await prisma.project.update({
      where: {
        id,
        author: { id: authorId },
      },
      data: {
        title,
        titleAlignment,
        link,
        content,
        cover,
        status: project.status === 'verified' ? 'published' : undefined,
        category: categoryId
          ? {
              connect: {
                id: categoryId,
              },
            }
          : {
              disconnect: true,
            },
        partners:
          partners && partners.length > 0
            ? {
                deleteMany: {},
                create: partners.map((partnerId: string) => ({
                  partner: {
                    connect: {
                      id: partnerId,
                    },
                  },
                })),
              }
            : {
                deleteMany: {},
              },
        tags:
          tags && tags.length > 0
            ? {
                deleteMany: {},
                create: tags.map((tagId: string) => ({
                  tag: {
                    connect: {
                      id: tagId,
                    },
                  },
                })),
              }
            : {
                deleteMany: {},
              },
      },
      select: {
        id: true,
        cover: true,
        title: true,
        titleAlignment: true,
        content: true,
        link: true,
        status: true,
        views: true,
        rejectionComment: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            label: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                label: true,
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
  }

  static async deleteProject(projectId: string, authorId: string) {
    return await prisma.project.delete({
      where: {
        id: projectId,
        author: {
          id: authorId,
        },
      },
      select: {
        id: true,
      },
    });
  }

  static async getProjectsForReview({
    limit,
    cursor,
  }: IGetProjectsForReviewQuery) {
    return await prisma.project.findMany({
      where: {
        status: {
          in: ['published', 'corrected'],
        },
      },
      take: limit || undefined,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        cover: true,
        title: true,
        status: true,
        rejectionComment: true,
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
        partners: {
          select: {
            partner: {
              select: {
                id: true,
                name: true,
                surname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  static async approveProject(id: string) {
    return await prisma.project.update({
      where: {
        id,
      },
      data: {
        status: 'verified',
        rejectionComment: null,
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  static async rejectProject(id: string, body: IRejectProjectBody) {
    return await prisma.project.update({
      where: {
        id,
      },
      data: {
        status: 'rejected',
        rejectionComment: body.rejectionComment,
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
