import { server } from '@repo/server';

export type GetProjectsForReviewQuery = Parameters<
  (typeof server.projects)['for-review']['get']
>[0]['query'];
