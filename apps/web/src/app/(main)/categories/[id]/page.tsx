import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ExhibitionProjects } from '@/widgets/exhibition-projects';
import {
  SearchControl,
  SortControl,
  OPTIONS,
} from '@/features/query-params-control';
import { CategoryService } from '@/entities/category';
import { Wrapper } from '@/shared/ui/wrapper';
import { Heading } from '@/shared/ui/heading';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const category = await CategoryService.getCategoryById(id).catch(() => null);

  if (!category) {
    return {
      title: 'категория не найдена',
    };
  }

  return {
    title: category.label,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await CategoryService.getCategoryById(id).catch(() =>
    notFound(),
  );

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <Heading>
          Все проекты с категорией{' '}
          <span className="text-muted-foreground">{category.label}</span>
        </Heading>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto]">
          <SearchControl placeholder="Поиск" />

          <div className="justify-self-end">
            <SortControl options={OPTIONS} />
          </div>
        </div>

        <ExhibitionProjects queryKey={category.id} category={category.id} />
      </Wrapper>
    </section>
  );
}
