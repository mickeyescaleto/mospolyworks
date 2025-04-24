'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/user/constants/keys';
import { UserService } from '@/entities/user/api/user-service';

export function useUsersForProject() {
  return useQuery({
    queryKey: [KEYS.USERS_FOR_PROJECT],
    queryFn: () => UserService.getUsersForProject(),
  });
}
