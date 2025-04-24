import { server } from '@repo/server';

export type GetProjectsQuery = Parameters<
  typeof server.projects.get
>[0]['query'];
