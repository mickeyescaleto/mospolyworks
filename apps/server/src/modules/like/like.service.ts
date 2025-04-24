import { prisma } from '@repo/database';

export class LikeService {
  static async createLike(
    projectId: string,
    { client, account }: { client: string; account?: string },
  ) {
    return await prisma.like.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        ...(account
          ? {
              user: {
                connect: {
                  id: account,
                },
              },
            }
          : {
              client,
            }),
      },
    });
  }

  static async deleteLike(
    id: string,
    { client, account }: { client: string; account?: string },
  ) {
    return await prisma.like.delete({
      where: {
        id,
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
    });
  }
}
