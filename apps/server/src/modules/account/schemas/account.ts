import { User } from '@/modules/user/schemas/user';

export const Account = User;

export type IAccount = typeof Account.static;
