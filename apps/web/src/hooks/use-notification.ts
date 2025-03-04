'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { NotificationService } from '@/services/notification';
import { Notification } from '@/types/notification';

export function useNotification() {
  const queryClient = useQueryClient();

  function useNotifications() {
    return useQuery({
      queryKey: ['notifications'],
      queryFn: () => NotificationService.getNotifications(),
    });
  }

  function useDelete() {
    return useMutation({
      mutationKey: ['delete-notification'],
      mutationFn: (id: string) => NotificationService.deleteNotification(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['notifications'] });
        const previousNotifications: Notification[] | undefined =
          queryClient.getQueryData(['notifications']);

        queryClient.setQueryData(['notifications'], (old: Notification[]) => {
          return old.filter((notification) => notification.id !== id);
        });

        return { previousNotifications };
      },
      onError: (error, id, context) => {
        toast.error('Ошибка при удалении уведомления');
        queryClient.setQueryData(
          ['notifications'],
          context?.previousNotifications,
        );
      },
    });
  }

  return { useNotifications, useDelete };
}
