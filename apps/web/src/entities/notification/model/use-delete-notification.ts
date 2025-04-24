'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/notification/constants/keys';
import { NotificationService } from '@/entities/notification/api/notification-service';
import { type Notification } from '@/entities/notification/types/notification';

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationService.deleteNotificationById(notificationId),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.NOTIFICATIONS] });

      const previousNotifications: Notification[] | undefined =
        queryClient.getQueryData([KEYS.NOTIFICATIONS]);

      queryClient.setQueryData([KEYS.NOTIFICATIONS], (old: Notification[]) => {
        return old.filter((notification) => notification.id !== id);
      });

      return { previousNotifications };
    },
    onError: (error, id, context) => {
      console.error(error.message);

      toast.error('Ошибка при удалении уведомления');

      queryClient.setQueryData(
        [KEYS.NOTIFICATIONS],
        context?.previousNotifications,
      );
    },
  });
}
