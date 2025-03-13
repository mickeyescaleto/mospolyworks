import { server } from '@repo/server';

export type User = NonNullable<
  Awaited<ReturnType<typeof server.auth.profile.get>>['data']
>;

export type UserLoginCredentials = Parameters<typeof server.auth.login.post>[0];
