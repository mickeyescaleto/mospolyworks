'use client';

import * as React from 'react';

import { cn } from '@repo/ui/utilities/cn';
import { EyeIcon, EyeOffIcon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';
import { Button } from '@repo/ui/core/button';

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [isHiding, setIsHiding] = React.useState(true);

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
        onClick={() => setIsHiding((prev) => !prev)}
        disabled={props.disabled}
        className="absolute top-0 right-0 h-full opacity-80 hover:bg-transparent hover:opacity-100 dark:hover:bg-transparent"
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
