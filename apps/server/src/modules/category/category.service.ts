import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

export abstract class CategoryService {
  static async getCategory(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        projects: {
          some: {
            status: {
              in: ['PUBLISHED', 'VERIFIED'],
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!category) {
      throw new NotFoundError(
        `Category with the ID ${categoryId} was not found`,
      );
    }

    return category;
  }

  static async getExhibitionCategories() {
    const categories = await prisma.category.findMany({
      where: {
        isHidden: false,
        projects: {
          some: {
            status: {
              in: ['PUBLISHED', 'VERIFIED'],
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        tags: {
          where: {
            taggedProjects: {
              some: {},
            },
          },
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return categories;
  }
}
