'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@repo/ui/core/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/core/avatar';
import { ChevronDownIcon, LogOutIcon, UserIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import Link from 'next/link';

export function ProfileMenu() {
  const { useUser, useLogout } = useAuth();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  function getAvatarFallback(name: string, surname: string) {
    return `${name.at(0)}${surname.at(0)}`.toUpperCase();
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="header"
          className="h-10 gap-0.5 px-2 hover:text-zinc-500 has-[>svg]:px-2 dark:hover:text-zinc-400"
        >
          <Avatar>
            <AvatarImage src={user.avatar} alt="Avatar" />
            <AvatarFallback>
              {getAvatarFallback(user.name, user.surname)}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="mt-0.5 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`}>
            <UserIcon />
            <span>Профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOutIcon />
          <span>Выход</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
