'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/account/constants/keys';
import { AccountService } from '@/entities/account/api/account-service';
import { type Account } from '@/entities/account/types/account';

export function useChangeSettings() {
  const queryClient = useQueryClient();

  const setAccount = useCallback(
    (data: Account | null) => queryClient.setQueryData([KEYS.ACCOUNT], data),
    [queryClient],
  );

  return useMutation({
    mutationFn: async (
      data: Parameters<typeof AccountService.changeSettings>[0],
    ) => {
      const promise = AccountService.changeSettings(data);

      toast.promise(promise, {
        loading: 'Подождите, идёт проверка данных...',
        success: 'Данные успешно изменены!',
        error: 'При изменении данных произошла ошибка',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: (data) => {
      setAccount(data);
    },
  });
}
