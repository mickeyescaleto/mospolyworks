import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

export class UserService {
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} was not found`);
    }

    return user;
  }

  static async getUsersForProject(accountId: string) {
    return await prisma.user.findMany({
      where: {
        id: {
          not: accountId,
        },
      },
      select: {
        id: true,
        name: true,
        surname: true,
        avatar: true,
      },
    });
  }
}
