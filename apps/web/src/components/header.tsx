'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@repo/ui/utilities/cn';
import { ProfileMenu } from '@/components/profile-menu';
import { NotificationPopover } from '@/components/notification-popover';
import { PlusIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';

export function Header() {
  const { useUser } = useAuth();
  const { data: user } = useUser();

  return (
    <header className="sticky top-0 z-20 bg-white/75 backdrop-blur backdrop-saturate-200 dark:bg-zinc-950/75">
      <nav className="wrapper">
        <div className="flex items-center border-b border-zinc-200 dark:border-zinc-700">
          <Link href="/" className="relative my-2 block size-10 rounded-full">
            <Image
              src="brand.svg"
              alt="Brand"
              fill
              priority
              draggable={false}
              className="select-none dark:invert"
            />
          </Link>

          <ul
            className={cn(
              'flex flex-1 items-center justify-end font-medium text-zinc-900 dark:text-white',
              {
                '-mx-4': !user,
              },
            )}
          >
            {user ? (
              <>
                <li>
                  <Button variant="header" size="icon" asChild>
                    <Link href="/projects/create">
                      <PlusIcon className="size-4.5" />
                    </Link>
                  </Button>
                </li>
                <li>
                  <NotificationPopover />
                </li>
                <li>
                  <ProfileMenu />
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="block p-4 opacity-70 transition-opacity hover:opacity-100 aria-[current=page]:opacity-100"
                >
                  Вход
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
