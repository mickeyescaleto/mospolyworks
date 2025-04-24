'use client';

import { Button } from '@repo/ui/core/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@repo/ui/core/dropdown-menu';

import { AccountLink } from '@/features/account-menu/ui/account-link';
import { CreateProjectButton } from '@/features/account-menu/ui/create-project-button';
import { LogoutButton } from '@/features/account-menu/ui/logout-button';
import { type Account } from '@/entities/account';
import { getInitials } from '@/shared/utilities/get-initials';
import { ColoredAvatar } from '@/shared/ui/colored-avatar';

type AccountMenuProps = {
  account: Account;
};

export function AccountMenu({ account }: AccountMenuProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ColoredAvatar
                  src={account.avatar}
                  alt="Account avatar"
                  fallback={getInitials([account.name, account.surname])}
                />

                <span className="sr-only">Меню</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <DropdownMenuContent align="end">
            <AccountLink account={account} />

            <CreateProjectButton />

            <DropdownMenuSeparator />

            <LogoutButton />
          </DropdownMenuContent>

          <TooltipContent side="bottom">
            <p>Меню</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
