'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Button } from '@repo/ui/core/button';
import { ScrollArea } from '@repo/ui/core/scroll-area';

import { useCheckReport, type Report } from '@/entities/report';
import { ROUTES } from '@/shared/constants/routes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

type ReportCardProps = {
  report: Report;
};

export function ReportCard({ report }: ReportCardProps) {
  const { mutate: checkReport, isPending } = useCheckReport();

  return (
    <div className="h-44 rounded-md border p-4">
      <div className="flex h-full flex-col gap-1">
        <Link
          href={`${ROUTES.PROJECTS}/${report.project.id}`}
          target="_blank"
          className="shrink-0"
        >
          <p className="text-foreground line-clamp-2 text-sm font-medium hover:underline">
            {report.project.title}
          </p>
        </Link>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <p className="text-muted-foreground text-sm">{report.content}</p>
          </ScrollArea>
        </div>

        <div className="mt-1 flex shrink-0 items-center justify-between">
          <p className="text-muted-foreground truncate text-xs">
            Создана{' '}
            {formatDistanceToNow(String(report.createdAt), {
              addSuffix: true,
              locale: ru,
            })}
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => checkReport(report.id)}
                >
                  Отметить
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Отметить как выполненное</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
