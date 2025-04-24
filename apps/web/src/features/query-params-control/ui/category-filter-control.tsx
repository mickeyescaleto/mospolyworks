'use client';

import { ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';

import { cn } from '@repo/ui/utilities/cn';
import { ChevronRightIcon } from '@repo/ui/core/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/core/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/ui/core/hover-card';

import { QUERY_PARAMS } from '@/features/query-params-control/constants/query-params';
import {
  type ExhibitionCategory,
  CategoryButton,
  useVisibleCategories,
} from '@/entities/category';
import { TagButton } from '@/entities/tag';
import { useTouchDevice } from '@/shared/hooks/use-touch-device';

type CategoryFilterControlProps = {
  categories: ExhibitionCategory[];
} & ComponentProps<'div'>;

export function CategoryFilterControl({
  categories,
  className,
  ...props
}: CategoryFilterControlProps) {
  const searchParams = useSearchParams();
  const isTouchDevice = useTouchDevice();

  const { visibleCategories, hiddenCategories, containerRef } =
    useVisibleCategories(categories);

  const param = searchParams.get(QUERY_PARAMS.CATEGORY)?.toString();

  const value =
    param && categories && categories.find((category) => category.id === param)
      ? param
      : '';

  const handleCategoryFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (
      (!params.get(QUERY_PARAMS.CATEGORY) && value === '') ||
      params.has(QUERY_PARAMS.CATEGORY, value)
    ) {
      return;
    }

    if (value) {
      params.set(QUERY_PARAMS.CATEGORY, value);
    } else {
      params.delete(QUERY_PARAMS.CATEGORY);
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex min-h-10 flex-1 items-center gap-1 overflow-x-hidden',
        className,
      )}
      {...props}
    >
      <CategoryButton
        isSelected={!value}
        onClick={() => handleCategoryFilter('')}
      >
        Все
      </CategoryButton>

      {visibleCategories.map((category) => (
        <HoverCard key={category.id}>
          <HoverCardTrigger asChild>
            <CategoryButton
              isSelected={category.id === value}
              onClick={() => handleCategoryFilter(category.id)}
            >
              {category.label}
            </CategoryButton>
          </HoverCardTrigger>

          {category.tags.length > 0 && (
            <HoverCardContent
              onPointerDownOutside={(event) => event.preventDefault()}
              hidden={isTouchDevice}
              align="start"
              sideOffset={0}
              className="w-auto overflow-hidden p-1"
            >
              <div className="flex max-h-32 max-w-64 flex-wrap gap-1 overflow-hidden overflow-y-auto rounded-sm">
                {category.tags.map((tag) => (
                  <TagButton key={tag.id} tag={tag} />
                ))}
              </div>
            </HoverCardContent>
          )}
        </HoverCard>
      ))}

      {hiddenCategories.length > 0 && (
        <Popover modal>
          <PopoverTrigger asChild>
            <CategoryButton
              isSelected={
                !!hiddenCategories.find((category) => category.id === value)
              }
            >
              <ChevronRightIcon className="size-4" />
            </CategoryButton>
          </PopoverTrigger>

          <PopoverContent
            onOpenAutoFocus={(event) => event.preventDefault()}
            align="start"
            className="flex max-h-96 w-56 flex-col gap-1 overflow-y-auto"
          >
            {hiddenCategories.map((category) => (
              <HoverCard key={category.id}>
                <HoverCardTrigger asChild>
                  <CategoryButton
                    isSelected={category.id === value}
                    onClick={() => handleCategoryFilter(category.id)}
                    className="rounded-sm"
                  >
                    {category.label}
                  </CategoryButton>
                </HoverCardTrigger>

                {category.tags.length > 0 && (
                  <HoverCardContent
                    onPointerDownOutside={(event) => event.preventDefault()}
                    hidden={isTouchDevice}
                    align="center"
                    side="right"
                    sideOffset={2}
                    className="w-auto overflow-hidden p-1"
                  >
                    <div className="flex max-h-32 max-w-64 flex-wrap gap-1 overflow-hidden overflow-y-auto rounded-sm">
                      {category.tags.map((tag) => (
                        <TagButton key={tag.id} tag={tag} />
                      ))}
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
