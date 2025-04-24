'use client';

import Link from 'next/link';

import { ShieldIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import { ACCOUNT_ROLES, useAccount } from '@/entities/account';
import { ROUTES } from '@/shared/constants/routes';

export function DashboardLink() {
  const { data: account, isPending } = useAccount();

  if (isPending || !account || !account.roles.includes(ACCOUNT_ROLES.ADMIN)) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.DASHBOARD}>
              <ShieldIcon className="size-4" />

              <span className="sr-only">Панель управления</span>
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Панель управления</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
