import { Static } from 'elysia';
import { tExternalUserData, tUserLoginCredentials } from '@/schemas/user';

export type ExternalUserData = Static<typeof tExternalUserData>;

export type UserLoginCredentials = Static<typeof tUserLoginCredentials>;

export type ExternalUserDataWithCredentials = ExternalUserData &
  UserLoginCredentials;
