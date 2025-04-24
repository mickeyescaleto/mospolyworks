import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

import { type IGetExhibitionCategoriesQuery } from '@/modules/category/schemas/routes/get-exhibition-categories';
import { type ICreateCategoryBody } from '@/modules/category/schemas/routes/create-category';

export class CategoryService {
  static async getCategoriesForProject() {
    return await prisma.category.findMany({
      where: {
        isHidden: false,
      },
      select: {
        id: true,
        label: true,
      },
    });
  }

  static async getExhibitionCategories({
    user,
  }: IGetExhibitionCategoriesQuery) {
    return await prisma.category.findMany({
      where: {
        isHidden: false,
        projects: {
          some: {
            ...(user && {
              author: {
                id: user,
              },
            }),
            status: {
              in: ['published', 'verified'],
            },
          },
        },
      },
      select: {
        id: true,
        label: true,
        tags: {
          where: {
            projects: {
              some: {
                project: {
                  status: {
                    in: ['published', 'verified'],
                  },
                },
              },
            },
          },
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  static async getExhibitionCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        label: true,
      },
    });

    if (!category) {
      throw new NotFoundError(`Category with the ID ${id} was not found`);
    }

    return category;
  }

  static async getCategories() {
    return await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        label: true,
        isHidden: true,
        _count: {
          select: {
            projects: true,
            tags: true,
          },
        },
      },
    });
  }

  static async createCategory(data: ICreateCategoryBody) {
    return await prisma.category.create({
      data,
      select: {
        id: true,
        label: true,
        isHidden: true,
        _count: {
          select: {
            projects: true,
            tags: true,
          },
        },
      },
    });
  }

  static async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  static async hideCategory(id: string) {
    return await prisma.category.update({
      where: {
        id,
      },
      data: {
        isHidden: true,
      },
      select: {
        id: true,
        label: true,
        isHidden: true,
        _count: {
          select: {
            projects: true,
            tags: true,
          },
        },
      },
    });
  }

  static async showCategory(id: string) {
    return await prisma.category.update({
      where: {
        id,
      },
      data: {
        isHidden: false,
      },
      select: {
        id: true,
        label: true,
        isHidden: true,
        _count: {
          select: {
            projects: true,
            tags: true,
          },
        },
      },
    });
  }
}
