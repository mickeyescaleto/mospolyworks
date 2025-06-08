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

import { getPartnersWord } from '@/features/select-partners/utilities/get-partners-word';
import { useUsersForProject } from '@/entities/user';
import { getInitials } from '@/shared/utilities/get-initials';
import { ColoredAvatar } from '@/shared/ui/colored-avatar';

type SelectPartnersProps = {
  partners: string[];
  onChange: (ids: string[]) => void;
};

export function SelectPartners({ partners, onChange }: SelectPartnersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(partners);
  const [inputValue, setInputValue] = useState('');

  const { data: users, isError, isPending } = useUsersForProject();

  const filteredUsers = useMemo(() => {
    if (!users) {
      return [];
    }

    type User = (typeof users)[number];

    const selectedUsers: User[] = [];
    const unselectedUsers: User[] = [];

    users.forEach((user: User) => {
      if (selectedIds.includes(user.id)) {
        selectedUsers.push(user);
      } else {
        unselectedUsers.push(user);
      }
    });

    const filterFn = (user: User) => {
      const label = `${user.surname} ${user.name}`;
      return label.toLowerCase().includes(inputValue.toLowerCase());
    };

    const filteredSelected = selectedUsers.filter(filterFn);
    const filteredUnselected = unselectedUsers.filter(filterFn);

    return [...filteredSelected, ...filteredUnselected];
  }, [users, inputValue, selectedIds]);

  const toggleSelection = (value: string) => {
    const newSelectedIds = selectedIds.includes(value)
      ? selectedIds.filter((id) => id !== value)
      : [...selectedIds, value];

    setSelectedIds(newSelectedIds);
    onChange(newSelectedIds);
  };

  if (isPending) {
    return <Skeleton className="w-80 rounded-full" />;
  }

  if (isError) {
    return (
      <span className="text-destructive text-sm">
        При загрузке пользователей произошла ошибка!
      </span>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="void"
          className="w-80 justify-between border px-4 font-normal"
        >
          {selectedIds.length > 0 ? (
            <span>Выбрано: {getPartnersWord(selectedIds.length)}</span>
          ) : (
            <span className="opacity-50">Выбрать партнёров</span>
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
            placeholder="Поиск пользователей"
            value={inputValue}
            onValueChange={setInputValue}
          />

          <CommandList className="mt-1">
            {filteredUsers.length === 0 ? (
              <CommandEmpty>Пользователи не найдены</CommandEmpty>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);

                return (
                  <CommandItem
                    key={user.id}
                    onSelect={() => toggleSelection(user.id)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="-ml-1 flex items-center gap-2">
                        <ColoredAvatar
                          src={user.avatar}
                          fallback={getInitials([user.name, user.surname])}
                          alt="User avatar"
                          classNames={{
                            avatar: 'size-6',
                          }}
                        />

                        <span className="truncate">{`${user.surname} ${user.name}`}</span>
                      </div>

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
