import { server } from '@repo/server';

export type User = NonNullable<
  Awaited<ReturnType<typeof server.authentication.profile.get>>['data']
>;

export type UserLoginCredentials = Parameters<
  typeof server.authentication.login.post
>[0];
