import Link from 'next/link';
import Image from 'next/image';

import { SearchSection } from '@/components/search-section';
import { ProjectsSection } from '@/components/projects-section';
import type { GetExhibitionProjectsQuery } from '@/types/project';

export default async function RootPage(props: {
  searchParams?: Promise<GetExhibitionProjectsQuery>;
}) {
  const searchParams = await props.searchParams;
  const query: GetExhibitionProjectsQuery = {
    search: searchParams?.search || '',
    theme: searchParams?.theme || '',
    sort: searchParams?.sort || 'date',
  };

  return (
    <>
      <section className="py-6 lg:py-10">
        <div className="wrapper flex flex-col items-center">
          <div className="flex flex-col items-center gap-y-1 lg:gap-y-2">
            <p className="text-4xl font-bold uppercase select-none md:text-5xl lg:text-6xl">
              Студенческое
            </p>
            <p className="text-4xl font-bold uppercase select-none md:text-5xl lg:text-6xl">
              Портфолио
            </p>
          </div>
          <Link
            href="https://mospolytech.ru/"
            target="_blank"
            className="mt-1.5 flex items-center gap-1.5 md:mt-2 lg:mt-3"
          >
            <div className="relative mt-0.5 size-5 rounded-full md:mt-1 md:size-6 lg:mt-1.5 lg:size-7">
              <Image
                src="brand.svg"
                alt="Brand"
                fill
                priority
                draggable={false}
                className="select-none dark:invert"
              />
            </div>
            <p className="text-lg font-bold lowercase select-none md:text-xl lg:text-2xl">
              Московского политеха
            </p>
          </Link>
        </div>
      </section>
      <SearchSection />
      <ProjectsSection query={query} />
    </>
  );
}
