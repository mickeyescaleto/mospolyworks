import { prisma, Prisma } from '@repo/database';

export class ProjectService {
  private readonly prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async project(params: {
    where: Prisma.ProjectWhereUniqueInput;
    select?: Prisma.ProjectSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.project.findUnique({
      where,
      select,
    });
  }

  async projects(params: {
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
    cursor?: Prisma.ProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    select?: Prisma.ProjectSelect;
  }) {
    const { where, orderBy, cursor, take, skip, select } = params;

    return await this.prisma.project.findMany({
      where,
      orderBy,
      cursor,
      take,
      skip,
      select,
    });
  }

  async create(params: {
    data: Prisma.ProjectCreateInput;
    select?: Prisma.ProjectSelect;
  }) {
    const { data, select } = params;

    return await this.prisma.project.create({ data, select });
  }

  async update(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
    select?: Prisma.ProjectSelect;
  }) {
    const { where, data, select } = params;

    return await this.prisma.project.update({
      where,
      data,
      select,
    });
  }

  async delete(params: {
    where: Prisma.ProjectWhereUniqueInput;
    select?: Prisma.ProjectSelect;
  }) {
    const { where, select } = params;

    return await this.prisma.project.delete({
      where,
      select,
    });
  }
}
