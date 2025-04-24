'use client';

import { ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { cn } from '@repo/ui/utilities/cn';
import { SearchIcon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';

import { QUERY_PARAMS } from '@/features/query-params-control/constants/query-params';

export function SearchControl({
  className,
  ...props
}: ComponentProps<'input'>) {
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(QUERY_PARAMS.SEARCH, value);
    } else {
      params.delete(QUERY_PARAMS.SEARCH);
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  }, 500);

  return (
    <div className="relative w-full">
      <Input
        defaultValue={searchParams.get(QUERY_PARAMS.SEARCH)?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        type="text"
        placeholder="Поиск"
        className={cn('pl-10', className)}
        {...props}
      />

      <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
    </div>
  );
}
