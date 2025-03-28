'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AuthService } from '@/services/auth';
import type { User, UserLoginCredentials } from '@/types/user';

export function useAuth() {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User | null) => queryClient.setQueryData(['profile'], data),
    [queryClient],
  );

  function useUserQuery() {
    return useQuery({
      queryKey: ['profile'],
      queryFn: () => AuthService.getProfile(),
    });
  }

  function useLoginMutation() {
    return useMutation({
      mutationKey: ['login'],
      mutationFn: (data: UserLoginCredentials) => AuthService.login(data),
      onSuccess: (data) => {
        setUser(data);
      },
      onError: (error) => {
        if ('status' in error) {
          switch (error.status) {
            case 400:
              toast.error('Неверный логин или пароль');
              break;
            case 503:
              toast.error('В данный момент сервис авторизации недоступен');
              break;
          }
        }
      },
    });
  }

  function useLogoutMutation() {
    return useMutation({
      mutationKey: ['logout'],
      mutationFn: () => AuthService.logout(),
      onSettled: () => {
        setUser(null);
      },
    });
  }

  return { useUserQuery, useLoginMutation, useLogoutMutation };
}
