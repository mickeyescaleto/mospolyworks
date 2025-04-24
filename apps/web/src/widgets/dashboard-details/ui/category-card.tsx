'use client';

import Link from 'next/link';

import { cn } from '@repo/ui/utilities/cn';
import { Badge } from '@repo/ui/core/badge';

import { getProjectsWord } from '@/widgets/dashboard-details/utilities/get-projects-word';
import { getTagsWord } from '@/widgets/dashboard-details/utilities/get-tags-word';
import { CategorySettingsButton } from '@/features/category-settings/ui/category-settings-button';
import { ChangeVisibilityCategoryButton } from '@/features/change-visibility-category';
import { DeleteCategoryButton } from '@/features/delete-category';
import { type Category } from '@/entities/category';
import { ROUTES } from '@/shared/constants/routes';

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative flex h-36 items-center justify-center rounded-md border">
      <div className="flex -translate-y-6 flex-col items-center gap-2 transition-transform duration-200 lg:translate-y-0 lg:group-hover:-translate-y-6">
        <Link
          href={`${ROUTES.CATEGORIES}/${category.id}`}
          target="_blank"
          className={cn('font-medium hover:underline', {
            'opacity-50': category.isHidden,
          })}
        >
          {category.label}
        </Link>

        <div className="space-x-2">
          <Badge variant="secondary">
            {getProjectsWord(category._count.projects)}
          </Badge>

          <Badge variant="secondary">{getTagsWord(category._count.tags)}</Badge>
        </div>
      </div>

      <div className="absolute bottom-5 flex space-x-2 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 lg:translate-y-4 lg:scale-95 lg:opacity-0">
        <CategorySettingsButton category={category} />

        <ChangeVisibilityCategoryButton category={category} />

        <DeleteCategoryButton category={category} />
      </div>
    </div>
  );
}
