import { Elysia, NotFoundError } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { CategoryService } from '@/modules/category/category.service';
import {
  GetExhibitionCategoriesQuery,
  GetExhibitionCategoriesResponse,
} from '@/modules/category/schemas/routes/get-exhibition-categories';
import { GetCategoryResponse } from '@/modules/category/schemas/routes/get-category';
import { GetCategoriesResponse } from '@/modules/category/schemas/routes/get-categories';
import {
  CreateCategoryBody,
  CreateCategoryResponse,
} from '@/modules/category/schemas/routes/create-category';
import { DeleteCategoryResponse } from '@/modules/category/schemas/routes/delete-category';
import { HideCategoryResponse } from '@/modules/category/schemas/routes/hide-category';
import { ShowCategoryResponse } from '@/modules/category/schemas/routes/show-category';
import { GetCategoriesForProjectResponse } from '@/modules/category/schemas/routes/get-categories-for-project';

const logger = getLogger('Categories');

export const categories = new Elysia({
  prefix: '/categories',
  tags: ['Категории'],
})
  .get(
    '/exhibitions',
    async ({ query, set }) => {
      try {
        const categories = await CategoryService.getExhibitionCategories(query);

        const message = `Categories have been successfully received`;

        logger.info(message);

        return categories;
      } catch {
        const message = 'An error occurred when receiving categories';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      query: GetExhibitionCategoriesQuery,
      response: response(GetExhibitionCategoriesResponse),
      detail: {
        summary: 'Получить все выставочные категории',
        description: 'Возвращает список с информацией выставочных категорий',
      },
    },
  )
  .get(
    '/exhibitions/:id',
    async ({ params, set }) => {
      try {
        const category = await CategoryService.getExhibitionCategoryById(
          params.id,
        );

        const message = `Category with the ID ${category.id} received successfully`;

        logger.info(message);

        return category;
      } catch (error) {
        if (error instanceof NotFoundError) {
          const message = error.message;

          logger.warn(message);

          set.status = 404;
          throw new Error(message);
        }

        const message = 'An error occurred when receiving the category';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      response: response(GetCategoryResponse),
      detail: {
        summary: 'Получить категорию по идентификатору',
        description: 'Возвращает информацию о конкретной категории',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/for-project',
        async ({ set }) => {
          try {
            const categories = await CategoryService.getCategoriesForProject();

            const message = `Categories have been successfully received`;

            logger.info(message);

            return categories;
          } catch {
            const message = 'An error occurred when receiving categories';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(GetCategoriesForProjectResponse),
          detail: {
            summary: 'Получить все категории для обновления проекта',
            description:
              'Возвращает список со всеми категориями для обновления проекта',
          },
        },
      )

      .get(
        '/',
        async ({ set }) => {
          try {
            const categories = await CategoryService.getCategories();

            const message = `Categories have been successfully received`;

            logger.info(message);

            return categories;
          } catch {
            const message = 'An error occurred when receiving categories';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(GetCategoriesResponse),
          detail: {
            summary: 'Получить все категории',
            description: 'Возвращает список с информацией о категориях',
          },
        },
      )
      .post(
        '/',
        async ({ body, set }) => {
          try {
            const category = await CategoryService.createCategory(body);

            const message = `Category with the ID ${category.id} has been successfully created`;

            logger.info(message);

            return category;
          } catch {
            const message = 'An error occurred when creating the category';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          body: CreateCategoryBody,
          response: response(CreateCategoryResponse),
          detail: {
            summary: 'Создать новую категорию',
            description:
              'Создаёт новую категорию и возвращает информацию о ней',
          },
        },
      )
      .delete(
        '/:id',
        async ({ params, set }) => {
          try {
            const category = await CategoryService.deleteCategory(params.id);

            const message = `Category with the ID ${category.id} has been successfully deleted`;

            logger.info(message);

            return category;
          } catch {
            const message = 'An error occurred when deleting the category';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(DeleteCategoryResponse),
          detail: {
            summary: 'Удалить категорию по идентификатору',
            description: 'Безвозвратно удаляет категорию по её идентификатору',
          },
        },
      )
      .post(
        '/:id/hide',
        async ({ params, set }) => {
          try {
            const category = await CategoryService.hideCategory(params.id);

            const message = `Category with the ID ${category.id} was successfully hidden`;

            logger.info(message);

            return category;
          } catch {
            const message = 'An error occurred when hiding the category';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(HideCategoryResponse),
          detail: {
            summary: 'Скрыть категорию',
            description: 'Скрывает категорию и возвращает информацию о ней',
          },
        },
      )
      .post(
        '/:id/show',
        async ({ params, set }) => {
          try {
            const category = await CategoryService.showCategory(params.id);

            const message = `Category with the ID ${category.id} was successfully showed`;

            logger.info(message);

            return category;
          } catch {
            const message = 'An error occurred when showing the category';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(ShowCategoryResponse),
          detail: {
            summary: 'Показать категорию',
            description: 'Показывает категорию и возвращает информацию о ней',
          },
        },
      ),
  );
