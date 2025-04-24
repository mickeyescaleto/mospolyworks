'use client';

import { PlusIcon } from '@repo/ui/core/icons';
import { DropdownMenuItem } from '@repo/ui/core/dropdown-menu';

import { useCreateProject } from '@/entities/project';

export function CreateProjectButton() {
  const { mutate: createProject } = useCreateProject();

  return (
    <DropdownMenuItem onSelect={() => createProject()}>
      <PlusIcon className="size-4" />

      <span>Создать проект</span>
    </DropdownMenuItem>
  );
}
