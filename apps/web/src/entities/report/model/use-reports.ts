'use client';

import { useQuery } from '@tanstack/react-query';

import { KEYS } from '@/entities/report/constants/keys';
import { ReportService } from '@/entities/report/api/report-service';

export function useReports() {
  return useQuery({
    queryKey: [KEYS.REPORTS],
    queryFn: () => ReportService.getReports(),
    staleTime: 1000 * 60 * 10,
  });
}
