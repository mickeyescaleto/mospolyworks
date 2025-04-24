import Link from 'next/link';

import { UserIcon } from '@repo/ui/core/icons';
import { DropdownMenuItem } from '@repo/ui/core/dropdown-menu';

import { type Account } from '@/entities/account';
import { ROUTES } from '@/shared/constants/routes';

type AccountLinkProps = {
  account: Account;
};

export function AccountLink({ account }: AccountLinkProps) {
  return (
    <DropdownMenuItem asChild>
      <Link href={`${ROUTES.USERS}/${account.id}`}>
        <UserIcon className="size-4" />

        <span>Профиль</span>
      </Link>
    </DropdownMenuItem>
  );
}
