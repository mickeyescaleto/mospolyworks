'use client';

import { CategoryCardSkeleton } from '@/widgets/dashboard-details/ui/category-card-skeleton';
import { CategoryCard } from '@/widgets/dashboard-details/ui/category-card';
import { CreateCategoryButton } from '@/features/create-category';
import { useCategories } from '@/entities/category';

export function CategoriesView() {
  const { data: categories, isError, isPending } = useCategories();

  return (
    <div className="grid w-full auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {!isError && <CreateCategoryButton />}

      {isPending ? (
        Array(15)
          .fill(0)
          .map((_, idx) => <CategoryCardSkeleton key={idx} />)
      ) : isError ? (
        <p className="text-destructive col-span-full text-center">
          При загрузке категорий произошла ошибка!
        </p>
      ) : (
        categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))
      )}
    </div>
  );
}
