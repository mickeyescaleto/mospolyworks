import { InternalServerError, NotFoundError } from 'elysia';

import { prisma } from '@repo/database';

import { config } from '@/config';
import { BadRequestError } from '@/errors/bad-request';
import {
  type IParseAccountProps,
  type IExternalAccountCredentials,
} from '@/modules/account/schemas/external-account';
import { type IAccount } from '@/modules/account/schemas/account';
import { type IUserRole } from '@/modules/user/schemas/user-role';

export class AccountService {
  private static async parseAccount({ user, token }: IParseAccountProps) {
    const roles: IUserRole[] =
      user['user_status'] === 'stud' ? ['student'] : ['staff'];

    const account: Omit<IAccount, 'id' | 'createdAt'> = {
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      login: user.login,
      avatar: user.avatar,
      group: user.group,
      course: user.course,
      faculty: user.faculty,
      specialty: user.specialty,
      specialization: user.specialization,
      externalToken: token,
      roles,
    };

    return account;
  }

  private static async getExternalAccount(
    credentials: IExternalAccountCredentials,
  ) {
    const { token } = await fetch(config.external.endpoint, {
      method: 'POST',
      headers: {
        'user-agent': config.fake.agent,
      },
      body: Object.entries({
        ulogin: credentials.login,
        upassword: credentials.password,
      }).reduce((f, [k, v]) => (f.append(k, v), f), new FormData()),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      if (response.status === 400) {
        throw new BadRequestError('Invalid credentials');
      }

      throw new InternalServerError('Internal Server Error');
    });

    const { user } = await fetch(
      `${config.external.endpoint}/?getUser&token=${token}`,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new InternalServerError('Internal Server Error');
    });

    const account = this.parseAccount({
      user: { ...user, ...credentials },
      token,
    });

    return account;
  }

  static async getAccountById(id: string) {
    const account = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      throw new NotFoundError(`Account with the ID ${id} was not found`);
    }

    return account;
  }

  static async getAccountByLogin(login: string) {
    const account = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!account) {
      return null;
    }

    return account;
  }

  static async createAccount(credentials: IExternalAccountCredentials) {
    const externalAccount = await this.getExternalAccount(credentials);

    return await prisma.user.create({
      data: {
        ...externalAccount,
      },
    });
  }

  static async updateAccount(
    account: IAccount,
    credentials: IExternalAccountCredentials,
  ) {
    const externalAccount = await this.getExternalAccount(credentials);

    if (account.roles.includes('admin')) {
      externalAccount.roles.push('admin');
    }

    return await prisma.user.update({
      where: {
        id: account.id,
      },
      data: {
        ...externalAccount,
      },
    });
  }

  static async actualizeAccount(userId: string) {
    const account = await this.getAccountById(userId);

    const { user } = await fetch(
      `${config.external.endpoint}/?getUser&token=${account.externalToken}`,
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new InternalServerError('Internal Server Error');
    });

    const externalAccount = await this.parseAccount({
      token: account.externalToken,
      user,
    });

    if (account.roles.includes('admin')) {
      externalAccount.roles.push('admin');
    }

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...externalAccount,
      },
    });
  }
}
