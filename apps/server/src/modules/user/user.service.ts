import axios from 'axios';

import { Prisma, prisma } from '@repo/database';

import { config } from '@/config';
import { parseExternalUser } from '@/utilities/parse-external-user';
import {
  tExternalUser,
  tExternalUserCredentials,
} from '@/modules/user/schemas/external-user';

export abstract class UserService {
  static async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  static async getUserByLogin(login: string) {
    return await prisma.user.findUnique({ where: { login } });
  }

  static async getExternalUser(
    credentials: typeof tExternalUserCredentials.static,
  ) {
    const {
      data: { token },
    } = await axios.post<{ token: string }>(
      config.external.endpoint,
      Object.entries({
        ulogin: credentials.login,
        upassword: credentials.password,
      }).reduce((f, [k, v]) => (f.append(k, v), f), new FormData()),
    );

    const { data } = await axios.get<{ user: typeof tExternalUser.static }>(
      `${config.external.endpoint}/?getUser&token=${token}`,
    );

    return await parseExternalUser({
      token,
      user: {
        ...data.user,
        ...credentials,
      },
    });
  }
}
