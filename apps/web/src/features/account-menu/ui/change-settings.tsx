'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { SettingsIcon } from '@repo/ui/core/icons';
import { DropdownMenuItem } from '@repo/ui/core/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/core/alert-dialog';
import { Label } from '@repo/ui/core/label';
import { Input } from '@repo/ui/core/input';

import { changeSettingsSchema } from '../schemas/change-settings';
import { useAccount, useChangeSettings } from '@/entities/account';
import { AvatarUpload } from './avatar-upload';
import { getInitials } from '@/shared/utilities/get-initials';

type FormValues = z.infer<typeof changeSettingsSchema>;

export function ChangeSettings() {
  const { data: account } = useAccount();
  const { mutate: changeSettings, isPending } = useChangeSettings();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(changeSettingsSchema),
    defaultValues: {
      avatar: account?.avatar,
      name: account?.name,
      surname: account?.surname,
    },
  });

  async function onSubmit(data: FormValues) {
    changeSettings(data);
    reset();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <SettingsIcon className="size-4" />

          <span>Настройки</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader className="sm:text-center">
          <AlertDialogTitle>Изменение настроек аккаунта</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <AvatarUpload
                defaultImage={field.value}
                fallback={getInitials([
                  account?.name || '',
                  account?.surname || '',
                ])}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />

          <div className="grid gap-2">
            <Label htmlFor="name">Имя</Label>

            <Input
              id="name"
              placeholder="Введите имя"
              type="text"
              {...register('name')}
            />

            {errors?.name && (
              <p className="text-destructive px-2 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="surname">Фамилия</Label>

            <Input
              id="surname"
              placeholder="Введите фамилию"
              type="text"
              {...register('surname')}
            />

            {errors?.surname && (
              <p className="text-destructive px-2 text-xs">
                {errors.surname.message}
              </p>
            )}
          </div>

          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel type="button" onClick={() => reset()}>
              Отменить
            </AlertDialogCancel>

            <AlertDialogAction type="submit" disabled={isPending || !isValid}>
              Изменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
