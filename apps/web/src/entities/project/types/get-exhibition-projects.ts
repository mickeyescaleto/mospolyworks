import { server } from '@repo/server';

export type GetExhibitionProjectsQuery = Parameters<
  typeof server.projects.exhibitions.get
>[0]['query'];
