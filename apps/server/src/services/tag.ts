import { prisma, Prisma } from '@repo/database';

export class TagService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async tag(params: {
    where: Prisma.TagWhereUniqueInput;
    select?: Prisma.TagSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.tag.findUnique({
      where,
      select,
    });
  }

  async tags(params: {
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput;
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.TagSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.tag.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.TagCreateInput;
    select?: Prisma.TagSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.tag.create({ data, select });
  }

  async update(params: {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.TagUpdateInput;
    select?: Prisma.TagSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.tag.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.TagWhereUniqueInput;
    select?: Prisma.TagSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.tag.delete({
      where,
      select,
    });
  }
}
