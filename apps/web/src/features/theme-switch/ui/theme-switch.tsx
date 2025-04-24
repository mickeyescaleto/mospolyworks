'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Moon, Sun } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  function changeTheme() {
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => changeTheme()}>
            <Sun className="block size-4 dark:hidden" />

            <Moon className="hidden size-4 dark:block" />

            <span className="sr-only">Переключить тему</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          <p>Переключить тему</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
