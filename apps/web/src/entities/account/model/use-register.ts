'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/account/constants/keys';
import { AccountService } from '@/entities/account/api/account-service';
import { type Account } from '@/entities/account/types/account';

export function useRegister() {
  const queryClient = useQueryClient();

  const setAccount = useCallback(
    (data: Account | null) => queryClient.setQueryData([KEYS.ACCOUNT], data),
    [queryClient],
  );

  return useMutation({
    mutationFn: async (data: Parameters<typeof AccountService.register>[0]) => {
      const promise = AccountService.register(data);

      toast.promise(promise, {
        loading: 'Подождите, идёт проверка данных...',
        success: (data) => `${data.name}, добро пожаловать!`,
        error: (error) => {
          if ('status' in error && error.status === 400) {
            return 'Пользователь с таким логином уже существует';
          }

          return 'В данный момент сервис авторизации недоступен';
        },
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
