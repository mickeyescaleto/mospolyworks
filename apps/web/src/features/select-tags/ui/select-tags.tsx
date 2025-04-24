'use client';

import { useMemo, useState } from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { CheckIcon, ChevronDownIcon } from '@repo/ui/core/icons';
import { Button } from '@repo/ui/core/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/core/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/core/command';
import { Skeleton } from '@repo/ui/core/skeleton';

import { getTagsWord } from '@/features/select-tags/utilities/get-tags-word';
import { useTagsForProject } from '@/entities/tag';

type SelectTagsProps = {
  categoryId: string;
  tags: string[];
  onChange: (ids: string[]) => void;
};

export function SelectTags({ categoryId, tags, onChange }: SelectTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    data: tagsForProject,
    isError,
    isPending,
  } = useTagsForProject(categoryId, !!categoryId);

  const filteredTags = useMemo(() => {
    if (!tagsForProject) {
      return [];
    }

    type Tag = (typeof tagsForProject)[number];

    const selectedTags: Tag[] = [];
    const unselectedTags: Tag[] = [];

    tagsForProject.forEach((tag: Tag) => {
      if (tags.includes(tag.id)) {
        selectedTags.push(tag);
      } else {
        unselectedTags.push(tag);
      }
    });

    const filterFn = (tag: Tag) => {
      return tag.label.toLowerCase().includes(inputValue.toLowerCase());
    };

    const filteredSelected = selectedTags.filter(filterFn);
    const filteredUnselected = unselectedTags.filter(filterFn);

    return [...filteredSelected, ...filteredUnselected];
  }, [tagsForProject, tags, inputValue]);

  const toggleSelection = (value: string) => {
    const newSelectedIds = tags.includes(value)
      ? tags.filter((id) => id !== value)
      : [...tags, value];

    onChange(newSelectedIds);
  };

  if (!categoryId) {
    return (
      <Button
        variant="void"
        className="w-80 cursor-not-allowed justify-between border px-4 font-normal"
        disabled={!!categoryId}
      >
        <span className="opacity-50">Выбрать теги</span>

        <ChevronDownIcon className="size-4 opacity-50 transition-all" />
      </Button>
    );
  }

  if (isPending) {
    return <Skeleton className="w-80 rounded-full" />;
  }

  if (isError) {
    return (
      <span className="text-destructive text-sm">
        При загрузке тегов произошла ошибка!
      </span>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="void"
          className="w-80 justify-between border px-4 font-normal"
          disabled={!categoryId}
        >
          {tags.length > 0 ? (
            <span>Выбрано: {getTagsWord(tags.length)}</span>
          ) : (
            <span className="opacity-50">Выбрать теги</span>
          )}

          <ChevronDownIcon
            className={cn('size-4 opacity-50 transition-all', {
              '-rotate-180': isOpen,
            })}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <Command>
          <CommandInput
            placeholder="Поиск тегов"
            value={inputValue}
            onValueChange={setInputValue}
          />

          <CommandList className="mt-1">
            {filteredTags.length === 0 ? (
              <CommandEmpty>Теги не найдены</CommandEmpty>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = tags.includes(tag.id);

                return (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => toggleSelection(tag.id)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="truncate">{tag.label}</span>

                      <CheckIcon
                        className={`ml-2 h-4 w-4 ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
