'use client';

import * as React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { cn } from '@repo/ui/utilities/cn';
import { Input } from '@repo/ui/core/input';
import { SearchIcon } from '@repo/ui/core/icons';

export function SearchInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="relative">
      <Input
        type="text"
        className={cn('pr-10', className)}
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        {...props}
      />
      <SearchIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50" />
    </div>
  );
}
