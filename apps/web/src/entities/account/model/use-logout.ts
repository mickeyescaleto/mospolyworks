'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { KEYS } from '@/entities/account/constants/keys';
import { AccountService } from '@/entities/account/api/account-service';
import { type Account } from '@/entities/account/types/account';

export function useLogout() {
  const queryClient = useQueryClient();

  const setAccount = useCallback(
    (data: Account | null) => queryClient.setQueryData([KEYS.ACCOUNT], data),
    [queryClient],
  );

  return useMutation({
    mutationFn: () => AccountService.logout(),
    onError: (error) => {
      console.error(error.message);
    },
    onSettled: () => {
      setAccount(null);
    },
  });
}
