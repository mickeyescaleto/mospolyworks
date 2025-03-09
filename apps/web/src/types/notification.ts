import { server } from '@repo/server';

export type Notification = NonNullable<
  Awaited<ReturnType<typeof server.notifications.index.get>>['data']
>[number];
