'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/report/constants/keys';
import { ReportService } from '@/entities/report/api/report-service';
import { type Report } from '@/entities/report/types/report';

export function useCheckReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const promise = ReportService.checkReport(id);

      toast.promise(promise, {
        loading: 'Подождите, проверяем жалобу...',
        success: 'Жалоба успешно проверена',
        error: 'Произошла ошибка! Жалоба не была проверена',
      });

      return promise;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [KEYS.REPORTS] });

      const previousReports =
        queryClient.getQueryData<Report[]>([KEYS.REPORTS]) || [];

      queryClient.setQueryData<Report[]>([KEYS.REPORTS], (old = []) =>
        old.filter((report) => report.id !== id),
      );

      return { previousReports };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([KEYS.REPORTS], context?.previousReports);

      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.REPORTS] });
    },
  });
}
