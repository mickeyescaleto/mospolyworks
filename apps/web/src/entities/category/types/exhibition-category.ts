import { CategoryService } from '@/entities/category/api/category-service';

export type ExhibitionCategory = Awaited<
  ReturnType<typeof CategoryService.getExhibitionCategories>
>[number];
