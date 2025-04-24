'use client';

import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { TagsIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/core/dialog';
import { ScrollArea } from '@repo/ui/core/scroll-area';
import { Input } from '@repo/ui/core/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import { TagButtonSkeleton } from '@/features/category-settings/ui/tag-button-skeleton';
import { TagButton } from '@/features/category-settings/ui/tag-button';
import { CreateTagButton } from '@/features/create-tag/ui/create-tag-button';
import { type Category } from '@/entities/category';
import { useTags } from '@/entities/tag';

type CategorySettingsButtonProps = {
  category: Category;
};

export function CategorySettingsButton({
  category,
}: CategorySettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const {
    data: tags,
    isError,
    isPending,
  } = useTags({ categoryId: category.id, enabled: isOpen });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isOpen} onOpenChange={(state) => setIsOpen(state)}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <TagsIcon className="size-4" />

                <span className="sr-only">Настроить теги</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <DialogContent className="px-3 sm:max-w-sm">
            <DialogHeader className="px-3">
              <DialogTitle>
                Настройка тегов для категории{' '}
                <span className="text-muted-foreground">{category.label}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <div className="px-3">
                <Input
                  placeholder="Поиск по тегам"
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </div>

              <ScrollArea className="relative max-h-64 px-3">
                <div className="flex flex-col gap-2">
                  {isPending ? (
                    Array(3)
                      .fill(0)
                      .map((_, idx) => <TagButtonSkeleton key={idx} />)
                  ) : isError ? (
                    <p className="text-destructive text-center text-sm">
                      При загрузке тегов произошла ошибка!
                    </p>
                  ) : tags.filter((tag) =>
                      tag.label
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()),
                    ).length > 0 ? (
                    tags
                      .filter((tag) =>
                        tag.label
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase()),
                      )
                      .map((tag) => <TagButton key={tag.id} tag={tag} />)
                  ) : (
                    <p className="text-muted-foreground text-center text-sm">
                      У данной категории отсутствуют теги
                    </p>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-1 px-3">
                <CreateTagButton category={category} />
              </div>
            </div>
          </DialogContent>

          <TooltipContent side="bottom">
            <p>Настроить теги</p>
          </TooltipContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}
