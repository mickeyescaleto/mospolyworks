'use client';

import { ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';

import { cn } from '@repo/ui/utilities/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@repo/ui/core/select';

import { QUERY_PARAMS } from '@/features/query-params-control/constants/query-params';

type SortControlProps = {
  options: Array<{
    value: string;
    label: string;
  }>;
} & ComponentProps<'button'>;

export function SortControl({
  options,
  className,
  ...props
}: SortControlProps) {
  const searchParams = useSearchParams();

  if (
    options.length === 0 &&
    new Set(options.map((option) => option.value)).size !== options.length
  ) {
    console.error('[SortControl]: Invalid options provided');
    return null;
  }

  const param = searchParams.get(QUERY_PARAMS.SORT)?.toString();

  const value =
    param && options.find((option) => option.value === param)
      ? param
      : options[0]!.value;

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== options[0]!.value) {
      params.set(QUERY_PARAMS.SORT, value);
    } else {
      params.delete(QUERY_PARAMS.SORT);
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <Select defaultValue={value} onValueChange={handleSort}>
      <SelectTrigger className={cn('w-52', className)} {...props}>
        {options.find((option) => option.value === value)?.label}
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
