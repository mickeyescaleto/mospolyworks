'use client';

import { Fragment, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

import { OPTIONS } from '@/features/query-params-control';
import {
  ExhibitionProjectsGrid,
  GetExhibitionProjectsQuery,
  useExhibitionProjects,
} from '@/entities/project';

type ExhibitionProjectsProps = {
  queryKey: string;
  category?: GetExhibitionProjectsQuery['category'];
  tag?: GetExhibitionProjectsQuery['tag'];
  author?: GetExhibitionProjectsQuery['author'];
  contributor?: GetExhibitionProjectsQuery['contributor'];
};

export function ExhibitionProjects({
  queryKey,
  category = '',
  tag = '',
  author = '',
  contributor = '',
}: ExhibitionProjectsProps) {
  const { ref, inView } = useInView();

  const searchParams = useSearchParams();

  type SortValue = Required<GetExhibitionProjectsQuery>['sort'];

  const sortValues = OPTIONS.map((option) => option.value) as SortValue[];

  const sortParam = searchParams.get('sort');

  const query: Omit<GetExhibitionProjectsQuery, 'cursor' | 'limit'> = {
    search: searchParams.get('search') || '',
    category: category || searchParams.get('category') || '',
    tag,
    author,
    contributor,
    sort:
      sortParam && sortValues.includes(sortParam as SortValue)
        ? (sortParam as SortValue)
        : 'date',
  };

  const {
    data: projects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useExhibitionProjects({ queryKey, query });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [projects, inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {status === 'error' ? (
        <p className="text-muted-foreground text-center">
          При загрузке проектов произошла ошибка
        </p>
      ) : (
        <Fragment>
          <ExhibitionProjectsGrid
            projects={status === 'pending' ? [] : projects.pages.flat()}
            isPending={status === 'pending'}
            isFetching={isFetchingNextPage}
          />

          <span
            ref={ref}
            data-slot="intersection-observer-marker"
            className="invisible"
          />
        </Fragment>
      )}
    </div>
  );
}
