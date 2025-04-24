import Link from 'next/link';

import { LogInIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import { ROUTES } from '@/shared/constants/routes';

export function LoginLink() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.LOGIN}>
              <LogInIcon className="size-4" />

              <span className="sr-only">Вход</span>
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Вход</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
