'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { cn } from '@repo/ui/utilities/cn';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/ui/core/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/core/popover';
import { Button } from '@repo/ui/core/button';
import { ChevronRightIcon } from '@repo/ui/core/icons';

import { useVisibleThemes } from '@/hooks/use-visible-themes';
import { useTouchDevice } from '@/hooks/use-touch-device';
import type { Theme } from '@/types/theme';

type FilteringProps = {
  themes: Theme[];
};

export function Filtering({ themes }: FilteringProps) {
  const { visibleThemes, hiddenThemes, containerRef } =
    useVisibleThemes(themes);
  const isTouchDevice = useTouchDevice();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const themeParam = searchParams.get('theme');

  const defaultTheme = themes.some((theme) => theme.title === themeParam)
    ? themeParam
    : '';

  function handleThemeFilter(value: string) {
    const params = new URLSearchParams(searchParams);
    if (params.has('theme', value)) {
      return;
    }
    if (value) {
      params.set('theme', value);
    } else {
      params.delete('theme');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div ref={containerRef} className="flex flex-1 gap-x-2 overflow-hidden">
      <Button
        data-active={defaultTheme === ''}
        type="button"
        variant="filter"
        onClick={() => handleThemeFilter('')}
        className="text-sm"
      >
        Все
      </Button>
      {visibleThemes.map((theme) => {
        if (theme.tags.length > 0 && !isTouchDevice) {
          return (
            <HoverCard key={theme.id} openDelay={200}>
              <HoverCardTrigger asChild>
                <Button
                  data-active={defaultTheme === theme.title}
                  type="button"
                  variant="filter"
                  onClick={() => handleThemeFilter(theme.title)}
                  className="text-sm"
                >
                  {theme.title}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="hidden-scrollbar flex flex-wrap gap-1 overflow-y-auto"
              >
                {theme.tags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <Link href={`/tags/${tag.id}`}>{tag.title}</Link>
                  </Button>
                ))}
              </HoverCardContent>
            </HoverCard>
          );
        }

        return (
          <Button
            key={theme.id}
            data-active={defaultTheme === theme.title}
            type="button"
            variant="filter"
            onClick={() => handleThemeFilter(theme.title)}
            className="text-sm"
          >
            {theme.title}
          </Button>
        );
      })}
      {hiddenThemes.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="filter"
              size="icon"
              className={cn(
                'size-9 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800',
                {
                  'duration-0 data-[state=closed]:border-transparent data-[state=closed]:bg-zinc-900 data-[state=closed]:text-white dark:data-[state=closed]:border-transparent dark:data-[state=closed]:bg-white dark:data-[state=closed]:text-zinc-900':
                    hiddenThemes.some((theme) => theme.title === defaultTheme),
                },
              )}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="hidden-scrollbar flex max-h-96 w-56 flex-col gap-y-1 overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {hiddenThemes.map((theme) => {
              if (theme.tags.length > 0 && !isTouchDevice) {
                return (
                  <HoverCard key={theme.id} openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Button
                        data-active={defaultTheme === theme.title}
                        type="button"
                        variant="filter"
                        onClick={() => handleThemeFilter(theme.title)}
                        className="text-sm"
                      >
                        {theme.title}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="center"
                      side="right"
                      sideOffset={2}
                    >
                      {theme.tags.map((tag) => (
                        <Button
                          key={tag.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/tags/${tag.id}`}>{tag.title}</Link>
                        </Button>
                      ))}
                    </HoverCardContent>
                  </HoverCard>
                );
              }

              return (
                <Button
                  key={theme.id}
                  data-active={defaultTheme === theme.title}
                  type="button"
                  variant="filter"
                  onClick={() => handleThemeFilter(theme.title)}
                  className="text-sm"
                >
                  {theme.title}
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
}
