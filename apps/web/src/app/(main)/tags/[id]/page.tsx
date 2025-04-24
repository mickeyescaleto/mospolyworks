import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/core/tooltip';

import { ExhibitionProjects } from '@/widgets/exhibition-projects';
import {
  SearchControl,
  SortControl,
  OPTIONS,
} from '@/features/query-params-control';
import { TagService } from '@/entities/tag';
import { Wrapper } from '@/shared/ui/wrapper';
import { Heading } from '@/shared/ui/heading';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const tag = await TagService.getTagById(id).catch(() => null);

  if (!tag) {
    return {
      title: 'тег не найден',
    };
  }

  return {
    title: tag.label,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tag = await TagService.getTagById(id).catch(() => notFound());

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <Heading>
          Все проекты с тегом{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground">{tag.label}</span>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>{tag.category.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Heading>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto]">
          <SearchControl placeholder="Поиск" />

          <div className="justify-self-end">
            <SortControl options={OPTIONS} />
          </div>
        </div>

        <ExhibitionProjects queryKey={tag.id} tag={tag.id} />
      </Wrapper>
    </section>
  );
}
