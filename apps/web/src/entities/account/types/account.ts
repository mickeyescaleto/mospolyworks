import { AccountService } from '@/entities/account/api/account-service';

export type Account = Awaited<ReturnType<typeof AccountService.getAccount>>;
