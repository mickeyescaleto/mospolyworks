'use client';

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

export function ChangeSettings() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <SettingsIcon className="size-4" />

          <span>Настройки</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Вы уверены, что хотите изменить настройки?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel type="button">Отменить</AlertDialogCancel>

          <AlertDialogAction type="submit">Изменить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
