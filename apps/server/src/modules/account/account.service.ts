import { NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

import { BadRequestError } from '@/errors/bad-request';
import { StorageService } from '@/modules/storage/storage.service';
import { type IRegisterBody } from '@/modules/account/schemas/routes/register';
import { type ILoginBody } from '@/modules/account/schemas/routes/login';
import { type IUpdateAccountBody } from '@/modules/account/schemas/routes/update-account';

export class AccountService {
  static async register(data: IRegisterBody) {
    const existingAccount = await prisma.user.findFirst({
      where: {
        OR: [{ login: data.login }, { email: data.email }],
      },
    });

    if (existingAccount) {
      throw new BadRequestError(`User already exists`);
    }

    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const account = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return account;
  }

  static async login(data: ILoginBody) {
    const account = await prisma.user.findUnique({
      where: {
        login: data.login,
      },
    });

    if (!account) {
      throw new BadRequestError(`Invalid credentials`);
    }

    const isCorrectPassword = await Bun.password.verify(
      data.password,
      account.password,
    );

    if (!isCorrectPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    return account;
  }

  static async getAccountById(id: string) {
    const account = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      throw new NotFoundError(`User with the ID ${id} was not found`);
    }

    return account;
  }

  static async updateAccount(id: string, data: IUpdateAccountBody) {
    const { name, surname, avatar } = data;

    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        surname,
        avatar:
          avatar instanceof File
            ? await StorageService.save(avatar)
            : (avatar as string),
      },
    });
  }
}
