import { server } from '@repo/server';

export type ExhibitionProject = NonNullable<
  Awaited<ReturnType<typeof server.projects.exhibition.get>>['data']
>[number];

export type GetExhibitionProjectsQuery = Parameters<
  typeof server.projects.exhibition.get
>[0]['query'];
