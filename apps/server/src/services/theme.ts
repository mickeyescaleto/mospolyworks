import { prisma, Prisma } from '@repo/database';

export class ThemeService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async theme(params: {
    where: Prisma.ThemeWhereUniqueInput;
    select?: Prisma.ThemeSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.theme.findUnique({
      where,
      select,
    });
  }

  async themes(params: {
    where?: Prisma.ThemeWhereInput;
    orderBy?: Prisma.ThemeOrderByWithRelationInput;
    cursor?: Prisma.ThemeWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.ThemeSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.theme.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.ThemeCreateInput;
    select?: Prisma.ThemeSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.theme.create({ data, select });
  }

  async update(params: {
    where: Prisma.ThemeWhereUniqueInput;
    data: Prisma.ThemeUpdateInput;
    select?: Prisma.ThemeSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.theme.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.ThemeWhereUniqueInput;
    select?: Prisma.ThemeSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.theme.delete({
      where,
      select,
    });
  }
}
