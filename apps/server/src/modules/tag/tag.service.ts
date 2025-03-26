import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

export abstract class TagService {
  static async getTag(tagId: string) {
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
        taggedProjects: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundError(`Tag with the ID ${tagId} was not found`);
    }

    return tag;
  }
}
