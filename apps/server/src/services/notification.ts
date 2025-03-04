import { prisma, Prisma } from '@repo/database';

export class NotificationService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async notification(params: {
    where: Prisma.NotificationWhereUniqueInput;
    select?: Prisma.NotificationSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.notification.findUnique({
      where,
      select,
    });
  }

  async notifications(params: {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.NotificationSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.notification.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.NotificationCreateInput;
    select?: Prisma.NotificationSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.notification.create({ data, select });
  }

  async update(params: {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.NotificationUpdateInput;
    select?: Prisma.NotificationSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.notification.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.NotificationWhereUniqueInput;
    select?: Prisma.NotificationSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.notification.delete({
      where,
      select,
    });
  }
}
