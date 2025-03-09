'use client';

import * as React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/core/select';

export function Sorting() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const defaultValue = searchParams.get('sort') || 'date';

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams);
    if (params.has('sort', value)) {
      return;
    }
    params.set('sort', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Select onValueChange={handleSort} defaultValue={defaultValue}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Самые недавние</SelectItem>
        <SelectItem value="rating">С высшими оценками</SelectItem>
        <SelectItem value="verified">Проверенные</SelectItem>
      </SelectContent>
    </Select>
  );
}
