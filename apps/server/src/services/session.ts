import { prisma, Prisma } from '@repo/database';

export class SessionService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async session(params: {
    where: Prisma.SessionWhereUniqueInput;
    select?: Prisma.SessionSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.session.findUnique({
      where,
      select,
    });
  }

  async sessions(params: {
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
    cursor?: Prisma.SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.SessionSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.session.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.SessionCreateInput;
    select?: Prisma.SessionSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.session.create({ data, select });
  }

  async update(params: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateInput;
    select?: Prisma.SessionSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.session.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.SessionWhereUniqueInput;
    select?: Prisma.SessionSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.session.delete({
      where,
      select,
    });
  }

  async deleteExpiredSessions() {
    return await this.prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
