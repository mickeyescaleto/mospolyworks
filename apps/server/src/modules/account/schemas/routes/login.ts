import { ExternalAccountCredentials } from '@/modules/account/schemas/external-account';
import { GetAccountResponse } from '@/modules/account/schemas/routes/get-account';

export const LoginBody = ExternalAccountCredentials;

export const LoginResponse = GetAccountResponse;
