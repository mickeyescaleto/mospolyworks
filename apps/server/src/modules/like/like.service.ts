import { prisma } from '@repo/database';

export abstract class LikeService {
  static async createAnonymousLike(projectId: string, userHash: string) {
    const like = await prisma.like.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        userHash,
      },
      select: {
        id: true,
      },
    });

    return like;
  }

  static async deleteAnonymousLike(projectId: string, userHash: string) {
    const like = await prisma.like.delete({
      where: {
        userHash_projectId: {
          userHash,
          projectId,
        },
      },
      select: {
        id: true,
      },
    });

    return like;
  }

  static async createLike(projectId: string, userId: string) {
    const like = await prisma.like.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return like;
  }

  static async deleteLike(projectId: string, userId: string) {
    const like = await prisma.like.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      select: {
        id: true,
      },
    });

    return like;
  }
}
