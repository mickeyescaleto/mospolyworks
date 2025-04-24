import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';
import { type ICreateTagBody } from '@/modules/tag/schemas/routes/create-tag';
import { type IGetTagsForProjectQuery } from '@/modules/tag/schemas/routes/get-tags-for-project';

export class TagService {
  static async getTagsForProject({ categoryId }: IGetTagsForProjectQuery) {
    return await prisma.tag.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      select: {
        id: true,
        label: true,
      },
    });
  }

  static async getTagById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        category: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundError(`Tag with the ID ${id} was not found`);
    }

    return tag;
  }

  static async getTags(categoryId: string) {
    return await prisma.tag.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        category: {
          id: categoryId,
        },
      },
      select: {
        id: true,
        label: true,
        category: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  static async createTag(data: ICreateTagBody) {
    return await prisma.tag.create({
      data: {
        label: data.label,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
      select: {
        id: true,
        label: true,
        category: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  static async deleteTag(id: string) {
    return await prisma.tag.delete({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
        category: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }
}
