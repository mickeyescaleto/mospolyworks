'use client';

import { ComponentProps, useState } from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { EyeIcon, EyeOffIcon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';
import { Button } from '@repo/ui/core/button';

type PasswordInputProps = ComponentProps<'input'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isHiding, setIsHiding] = useState(true);

  return (
    <div className="relative">
      <Input
        type={isHiding ? 'password' : 'text'}
        className={cn('pr-10', className)}
        {...props}
      />

      <Button
        variant="ghost"
        type="button"
        size="icon"
        onClick={() => setIsHiding((prev) => !prev)}
        disabled={props.disabled}
        className="text-muted-foreground absolute top-1/2 right-1 size-8 -translate-y-1/2 transform"
      >
        {!isHiding ? (
          <EyeIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="size-4" aria-hidden="true" />
        )}

        <span className="sr-only">
          {isHiding ? 'Показать пароль' : 'Скрыть пароль'}
        </span>
      </Button>
    </div>
  );
}
