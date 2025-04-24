'use client';

import { useFormContext, Controller } from 'react-hook-form';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from '@repo/ui/core/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/core/dropdown-menu';
import { Button } from '@repo/ui/core/button';

type EditAlignmentButtonProps = {
  name: string;
};

export function EditAlignmentButton({ name }: EditAlignmentButtonProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-surface hover:bg-secondary invisible absolute right-0 bottom-0 z-10 translate-y-full opacity-0 shadow-md peer-focus:visible peer-focus:opacity-100 data-[state=open]:visible data-[state=open]:opacity-100"
            >
              {value === 'left' && <AlignLeftIcon className="size-4" />}
              {value === 'center' && <AlignCenterIcon className="size-4" />}
              {value === 'right' && <AlignRightIcon className="size-4" />}
              {value === 'justify' && <AlignJustifyIcon className="size-4" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onChange('left')}>
              <AlignLeftIcon className="size-4" />

              <span>По левому краю</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChange('center')}>
              <AlignCenterIcon className="size-4" />

              <span>По центру</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChange('right')}>
              <AlignRightIcon className="size-4" />

              <span>По правому краю</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChange('justify')}>
              <AlignJustifyIcon className="size-4" />

              <span>По ширине</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}
