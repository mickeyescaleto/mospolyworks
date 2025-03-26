import { Elysia, NotFoundError } from 'elysia';

import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { CategoryService } from '@/modules/category/category.service';
import { tGetExhibitionCategoriesResponse } from '@/modules/category/schemas/get-exhibition-categories';
import {
  tGetCategoryParams,
  tGetCategoryResponse,
} from '@/modules/category/schemas/get-category';

const logger = getLogger('Categories');

export const categories = new Elysia({
  prefix: '/categories',
  tags: ['Categories'],
})
  .get(
    '/exhibition',
    async ({ error }) => {
      try {
        const categories = await CategoryService.getExhibitionCategories();

        const message = `Categories have been successfully received`;

        logger.info(message);

        return categories;
      } catch {
        const message = 'An error occurred when receiving categories';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      response: {
        200: tGetExhibitionCategoriesResponse,
        500: tError,
      },
      detail: {
        summary: 'Get all exhibition categories',
        description: 'Returns a list of all available exhibition categories',
      },
    },
  )
  .get(
    '/:categoryId',
    async ({ params, error }) => {
      try {
        const category = await CategoryService.getCategory(params.categoryId);

        const message = `Category with the ID ${category.id} received successfully`;

        logger.info(message);

        return category;
      } catch (e) {
        if (e instanceof NotFoundError) {
          const message = e.message;

          logger.warn(message);

          return error('Not Found', { message });
        }

        const message = 'An error occurred when receiving the category';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      params: tGetCategoryParams,
      response: {
        200: tGetCategoryResponse,
        404: tError,
        500: tError,
      },
      detail: {
        summary: 'Get category by ID',
        description: 'Returns detailed information about a specific category',
      },
    },
  );
