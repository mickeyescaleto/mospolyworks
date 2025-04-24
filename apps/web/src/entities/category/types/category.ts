import { CategoryService } from '@/entities/category/api/category-service';

export type Category = Awaited<
  ReturnType<typeof CategoryService.getCategories>
>[number];
