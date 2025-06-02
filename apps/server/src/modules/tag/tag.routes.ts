import { Elysia, NotFoundError } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { TagService } from '@/modules/tag/tag.service';
import { GetTagResponse } from '@/modules/tag/schemas/routes/get-tag';
import { GetTagsResponse } from '@/modules/tag/schemas/routes/get-tags';
import {
  CreateTagBody,
  CreateTagResponse,
} from '@/modules/tag/schemas/routes/create-tag';
import { DeleteTagResponse } from '@/modules/tag/schemas/routes/delete-tag';
import {
  GetTagsForProjectQuery,
  GetTagsForProjectResponse,
} from '@/modules/tag/schemas/routes/get-tags-for-project';

const logger = getLogger('Tags');

export const tags = new Elysia({
  prefix: '/tags',
  tags: ['Теги'],
})
  .get(
    '/exhibitions/:id',
    async ({ params, set }) => {
      try {
        const tag = await TagService.getTagById(params.id);

        const message = `Tag with the ID ${tag.id} received successfully`;

        logger.info(message);

        return tag;
      } catch (error) {
        if (error instanceof NotFoundError) {
          const message = error.message;

          logger.warn(message);

          set.status = 404;
          throw new Error(message);
        }

        const message = 'An error occurred when receiving the tag';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      response: response(GetTagResponse),
      detail: {
        summary: 'Получить тег по идентификатору',
        description: 'Возвращает информацию о конкретном теге',
      },
    },
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/for-project',
        async ({ query, set }) => {
          try {
            const tags = await TagService.getTagsForProject(query);

            const message = `Tags have been successfully received`;

            logger.info(message);

            return tags;
          } catch {
            const message = 'An error occurred when receiving tags';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          query: GetTagsForProjectQuery,
          response: response(GetTagsForProjectResponse),
          detail: {
            summary: 'Получить все теги для обновления проекта',
            description:
              'Возвращает список со всеми тегами для обновления проекта',
          },
        },
      )
      .get(
        '/:id',
        async ({ params, set }) => {
          try {
            const tags = await TagService.getTags(params.id);

            const message = `Tags have been successfully received`;

            logger.info(message);

            return tags;
          } catch {
            const message = 'An error occurred when receiving tags';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(GetTagsResponse),
          detail: {
            summary: 'Получить тег',
            description: 'Возвращает информацию о теге по идентификатору',
          },
        },
      )
      .post(
        '/',
        async ({ body, set }) => {
          try {
            const tag = await TagService.createTag(body);

            const message = `Tag with the ID ${tag.id} has been successfully created`;

            logger.info(message);

            return tag;
          } catch {
            const message = 'An error occurred when creating the tag';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          body: CreateTagBody,
          response: response(CreateTagResponse),
          detail: {
            summary: 'Создать новый тег',
            description: 'Создаёт новый тег и возвращает информацию о нём',
          },
        },
      )
      .delete(
        '/:id',
        async ({ params, set }) => {
          try {
            const tag = await TagService.deleteTag(params.id);

            const message = `Tag with the ID ${tag.id} has been successfully deleted`;

            logger.info(message);

            return tag;
          } catch {
            const message = 'An error occurred when deleting the tag';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(DeleteTagResponse),
          detail: {
            summary: 'Удалить тег по идентификатору',
            description: 'Безвозвратно удаляет тег по его идентификатору',
          },
        },
      ),
  );
