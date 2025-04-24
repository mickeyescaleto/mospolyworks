'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { KEYS } from '@/entities/report/constants/keys';
import { ReportService } from '@/entities/report/api/report-service';

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Parameters<typeof ReportService.createReport>[0],
    ) => {
      const promise = ReportService.createReport(data);

      toast.promise(promise, {
        loading: 'Подождите, проверяем данные...',
        success: 'Жалоба отправлена',
        error: 'Произошла ошибка! Жалоба не отправлена',
      });

      return promise;
    },
    onError: (error) => {
      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.REPORTS] });
    },
  });
}
