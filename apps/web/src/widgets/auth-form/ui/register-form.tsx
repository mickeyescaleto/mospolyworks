'use client';

import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Loader2Icon } from '@repo/ui/core/icons';
import { Input } from '@repo/ui/core/input';
import { Label } from '@repo/ui/core/label';
import { Button } from '@repo/ui/core/button';

import { registerSchema } from '@/widgets/auth-form/schemas/register';
import { PasswordInput } from '@/widgets/auth-form/ui/password-input';
import { useRegister } from '@/entities/account';

type FormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid gap-2">
        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="name">
            Имя
          </Label>

          <Input
            id="name"
            placeholder="Введите имя"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isPending}
            {...register('name')}
          />

          {errors?.name && (
            <p className="text-destructive px-2 text-xs">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="surname">
            Фамилия
          </Label>

          <Input
            id="surname"
            placeholder="Введите фамилию"
            type="text"
            autoCapitalize="none"
            autoComplete="surname"
            autoCorrect="off"
            disabled={isPending}
            {...register('surname')}
          />

          {errors?.surname && (
            <p className="text-destructive px-2 text-xs">
              {errors.surname.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="sr-only" htmlFor="email">
            Электронная почта
          </Label>

          <Input
            id="email"
            placeholder="Введите почту"
            type="text"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isPending}
            {...register('email')}
          />

          {errors?.email && (
            <p className="text-destructive px-2 text-xs">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
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
            <p className="text-destructive px-2 text-xs">
              {errors.login.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
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
            <p className="text-destructive px-2 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending || !isValid}>
        {isPending ? (
          <Loader2Icon className="size-6 animate-spin" />
        ) : (
          <Fragment>Регистрация</Fragment>
        )}
      </Button>
    </form>
  );
}
