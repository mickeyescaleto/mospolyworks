'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2Icon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';
import { Label } from '@repo/ui/core/label';
import { Button } from '@repo/ui/core/button';

import { useAuth } from '@/hooks/use-auth';
import { PasswordInput } from '@/components/password-input';
import { userAuthSchema } from '@/schemas/user-auth';
import type { UserLoginCredentials } from '@/types/user';

export function UserAuthForm() {
  const { useLoginMutation } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserLoginCredentials>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: UserLoginCredentials) {
    login(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="login">
            Логин
          </Label>
          <Input
            id="login"
            placeholder="Введите логин"
            type="text"
            autoCapitalize="none"
            autoComplete="login"
            autoCorrect="off"
            disabled={isPending}
            {...register('login')}
          />
          {errors?.login && (
            <p className="px-1 text-xs text-red-600">{errors.login.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="password">
            Пароль
          </Label>
          <PasswordInput
            id="password"
            placeholder="Введите пароль"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            disabled={isPending}
            {...register('password')}
          />
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending || !isValid}>
        {isPending ? (
          <Loader2Icon className="size-6 animate-spin" />
        ) : (
          <>Вход</>
        )}
      </Button>
    </form>
  );
}
