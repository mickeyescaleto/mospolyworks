import { tExternalAccountBody } from '@/modules/account/schemas/external-account';
import { tAccountResponse } from '@/modules/account/schemas/account';

export const tLoginBody = tExternalAccountBody;

export type LoginBody = typeof tLoginBody.static;

export const tLoginResponse = tAccountResponse;
