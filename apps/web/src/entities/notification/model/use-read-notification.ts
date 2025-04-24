'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { KEYS } from '@/entities/notification/constants/keys';
import { NotificationService } from '@/entities/notification/api/notification-service';
import { type Notification } from '@/entities/notification/types/notification';

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationService.readNotificationById(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.NOTIFICATIONS] });

      const previousNotifications: Notification[] | undefined =
        queryClient.getQueryData([KEYS.NOTIFICATIONS]);

      queryClient.setQueryData([KEYS.NOTIFICATIONS], (old: Notification[]) => {
        return old.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        );
      });

      return { previousNotifications };
    },
    onError: (error, id, context) => {
      console.error(error.message);

      queryClient.setQueryData(
        [KEYS.NOTIFICATIONS],
        context?.previousNotifications,
      );
    },
  });
}
