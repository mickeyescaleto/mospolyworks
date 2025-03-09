import { server } from '@repo/server';

export type Theme = NonNullable<
  Awaited<ReturnType<typeof server.themes.exhibition.get>>['data']
>[number];
