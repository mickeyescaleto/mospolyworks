import { ExhibitionProjects } from '@/widgets/exhibition-projects';
import {
  CategoryFilterControl,
  OPTIONS,
  SearchControl,
  SortControl,
} from '@/features/query-params-control';
import { CategoryService } from '@/entities/category';
import { Wrapper } from '@/shared/ui/wrapper';
import { Heading } from '@/shared/ui/heading';

export default async function MainPage() {
  const categories = await CategoryService.getExhibitionCategories();

  return (
    <section>
      <Wrapper className="flex flex-col gap-4">
        <Heading>Все опубликованные проекты</Heading>

        <div className="grid max-w-full grid-cols-[1fr_auto] gap-2">
          <div className="col-span-2 lg:col-span-1">
            <SearchControl placeholder="Поиск по проектам" />
          </div>

          <div className="order-2 col-span-1 lg:order-1">
            <SortControl options={OPTIONS} />
          </div>

          <div className="order-1 col-span-1 max-w-full overflow-hidden lg:order-2 lg:col-span-2">
            <CategoryFilterControl categories={categories} />
          </div>
        </div>

        <ExhibitionProjects queryKey="all" />
      </Wrapper>
    </section>
  );
}
