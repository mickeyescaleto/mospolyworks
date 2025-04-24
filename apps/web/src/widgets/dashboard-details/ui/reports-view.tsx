'use client';

import { ReportCardSkeleton } from '@/widgets/dashboard-details/ui/report-card-skeleton';
import { ReportCard } from '@/widgets/dashboard-details/ui/report-card';
import { useReports } from '@/entities/report';

export function ReportsView() {
  const { data: reports, isError, isPending } = useReports();

  return (
    <div className="grid w-full auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isPending ? (
        Array(9)
          .fill(0)
          .map((_, idx) => <ReportCardSkeleton key={idx} />)
      ) : isError ? (
        <p className="text-destructive col-span-full text-center">
          При загрузке жалоб произошла ошибка!
        </p>
      ) : reports.length > 0 ? (
        reports.map((report) => <ReportCard key={report.id} report={report} />)
      ) : (
        <p className="text-muted-foreground col-span-full text-center">
          Жалобы отсутствуют
        </p>
      )}
    </div>
  );
}
