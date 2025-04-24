'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/account/constants/keys';
import { AccountService } from '@/entities/account/api/account-service';

export function useAccount() {
  return useQuery({
    queryKey: [KEYS.ACCOUNT],
    queryFn: () => AccountService.getAccount(),
    staleTime: Infinity,
  });
}
