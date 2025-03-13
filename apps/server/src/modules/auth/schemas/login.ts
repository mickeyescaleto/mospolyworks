import { tExternalUserCredentials } from '@/modules/user/schemas/external-user';
import { tGetProfileResponse } from '@/modules/auth/schemas/profile';

export const tLoginBody = tExternalUserCredentials;

export const tLoginResponse = tGetProfileResponse;
