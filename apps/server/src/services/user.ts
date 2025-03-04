import axios from 'axios';
import { prisma, Prisma } from '@repo/database';
import { config } from '@/config';
import { parseExternalUser } from '@/utilities/parse-external-user';
import { ExternalUserData, UserLoginCredentials } from '@/types/user';

export class UserService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async user(params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.user.findUnique({
      where,
      select,
    });
  }

  async users(params: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.UserSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.user.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.UserCreateInput;
    select?: Prisma.UserSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.user.create({ data, select });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    select?: Prisma.UserSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.user.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.user.delete({
      where,
      select,
    });
  }

  async externalUser(credentials: UserLoginCredentials) {
    const {
      data: { token },
    } = await axios.post<{ token: string }>(
      config.external.endpoint,
      Object.entries({
        ulogin: credentials.login,
        upassword: credentials.password,
      }).reduce((f, [k, v]) => (f.append(k, v), f), new FormData()),
    );

    const { data } = await axios.get<{ user: ExternalUserData }>(
      `${config.external.endpoint}/?getUser&token=${token}`,
    );

    const parsedData = parseExternalUser({
      token,
      user: {
        ...data.user,
        ...credentials,
      },
    });

    return parsedData;
  }
}
