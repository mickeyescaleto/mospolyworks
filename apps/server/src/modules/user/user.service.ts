import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

import { type CreateUserBody } from '@/modules/user/schemas/create-user';

export abstract class UserService {
  static async createUser(data: CreateUserBody) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with the ID ${userId} was not found`);
    }

    return user;
  }

  static async getUserByLogin(login: string) {
    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with the login ${login} was not found`);
    }

    return user;
  }

  static async updateUser(userId: string, data: Partial<CreateUserBody>) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });

    return user;
  }

  static async getCountUsers() {
    const count = await prisma.user.count();

    return count;
  }

  static async getUsersBatch(skip: number, take: number) {
    const users = await prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
      },
    });

    return users;
  }
}
