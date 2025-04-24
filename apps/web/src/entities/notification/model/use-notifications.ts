'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/notification/constants/keys';
import { NotificationService } from '@/entities/notification/api/notification-service';

export function useNotifications() {
  return useQuery({
    queryKey: [KEYS.NOTIFICATIONS],
    queryFn: () => NotificationService.getNotifications(),
  });
}
