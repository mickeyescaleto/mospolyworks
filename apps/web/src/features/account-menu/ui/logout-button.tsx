'use client';

import { LogOutIcon } from '@repo/ui/core/icons';
import { DropdownMenuItem } from '@repo/ui/core/dropdown-menu';

import { useLogout } from '@/entities/account';

export function LogoutButton() {
  const { mutate: logout } = useLogout();

  return (
    <DropdownMenuItem variant="destructive" onSelect={() => logout()}>
      <LogOutIcon className="size-4" />

      <span>Выход</span>
    </DropdownMenuItem>
  );
}
