'use client';

import { Fragment } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@repo/ui/core/select';
import { Skeleton } from '@repo/ui/core/skeleton';

import { useCategoriesForProject } from '@/entities/category';

type SelectCategoryProps = {
  categoryId: string;
  onChange: (id: string) => void;
  setValue: (...args: any) => void;
};

export function SelectCategory({
  categoryId,
  onChange,
  setValue,
}: SelectCategoryProps) {
  const { data: categories, isError, isPending } = useCategoriesForProject();

  if (isPending) {
    return <Skeleton className="w-80 rounded-full" />;
  }

  if (isError) {
    return (
      <span className="text-destructive text-sm">
        При загрузке категорий произошла ошибка!
      </span>
    );
  }

  return (
    <Fragment>
      <Select
        defaultValue={categoryId}
        onValueChange={(value) => {
          onChange(value);
          setValue('tags', []);
        }}
      >
        <SelectTrigger className="w-80">
          {categories.find((category) => category.id === categoryId)?.label ||
            'Выбрать категорию'}
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {categoryId &&
        !categories.find((category) => category.id === categoryId) && (
          <div className="text-muted-foreground text-sm">
            <p>Категория, которая была выбрана является скрытой.</p>
            <p>Если хотите - выберите новую категорию.</p>
          </div>
        )}
    </Fragment>
  );
}
