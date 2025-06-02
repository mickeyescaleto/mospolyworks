import { Elysia, NotFoundError } from 'elysia';

import { BadRequestError } from '@/errors/bad-request';
import { getLogger } from '@/utilities/logger';
import { response } from '@/utilities/response';
import { security } from '@/plugins/security';
import { client } from '@/plugins/client';
import { account } from '@/plugins/account';
import { ProjectService } from '@/modules/project/project.service';
import { GetExhibitionProjectResponse } from '@/modules/project/schemas/routes/get-exhibition-project';
import {
  GetExhibitionProjectsQuery,
  GetExhibitionProjectsResponse,
} from '@/modules/project/schemas/routes/get-exhibition-projects';
import { GetProjectResponse } from '@/modules/project/schemas/routes/get-project';
import { CreateProjectResponse } from '@/modules/project/schemas/routes/create-project';
import { PublishProjectResponse } from '@/modules/project/schemas/routes/publish-project';
import { UnpublishProjectResponse } from '@/modules/project/schemas/routes/unpublish-project';
import { DeleteProjectResponse } from '@/modules/project/schemas/routes/delete-project';
import {
  GetProjectsForReviewQuery,
  GetProjectsForReviewResponse,
} from '@/modules/project/schemas/routes/get-projects-for-review';
import {
  UpdateProjectBody,
  UpdateProjectResponse,
} from '@/modules/project/schemas/routes/update-project';
import { GetProjectLikeResponse } from '@/modules/project/schemas/routes/get-project-like';
import {
  GetProjectsQuery,
  GetProjectsResponse,
} from '@/modules/project/schemas/routes/get-projects';
import { ApproveProjectResponse } from '@/modules/project/schemas/routes/approve-project';
import {
  RejectProjectBody,
  RejectProjectResponse,
} from '@/modules/project/schemas/routes/reject-project';
import { NotificationService } from '@/modules/notification/notification.service';
import { GetProjectForReviewResponse } from '@/modules/project/schemas/routes/get-project-for-review';

const logger = getLogger('Projects');

export const projects = new Elysia({
  prefix: '/projects',
  tags: ['Проекты'],
})
  .get(
    '/exhibitions',
    async ({ query, set }) => {
      try {
        const projects = await ProjectService.getExhibitionProjects(query);

        const message = 'Exhibition projects have been successfully received';

        logger.info(message);

        return projects.map(({ partners, ...rest }) => ({
          ...rest,
          partners: partners.map((partner) => partner.partner),
        }));
      } catch {
        const message = 'An error occurred when receiving exhibition projects';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      query: GetExhibitionProjectsQuery,
      response: response(GetExhibitionProjectsResponse),
      detail: {
        summary: 'Получить список выставочных проектов',
        description:
          'Возвращает список выставочных проектов с краткой информацией',
      },
    },
  )
  .get(
    '/exhibitions/:id',
    async ({ params, set }) => {
      try {
        const project = await ProjectService.getExhibitionProjectById(
          params.id,
        );

        const message = `Exhibition project with the ID ${project.id} received successfully`;

        logger.info(message);

        const { partners, tags, ...rest } = project;

        return {
          ...rest,
          partners: partners.map((partner) => partner.partner),
          tags: tags.map((tag) => tag.tag),
        };
      } catch {
        const message =
          'An error occurred when receiving the exhibition project';

        logger.error(message);

        set.status = 500;
        throw new Error(message);
      }
    },
    {
      response: response(GetExhibitionProjectResponse),
      detail: {
        summary: 'Получить выставочный проект по идентификатору',
        description:
          'Возвращает полную информацию о конкретном выставочном проекте',
      },
    },
  )
  .guard((app) =>
    app
      .use(client)
      .use(account)
      .get(
        '/exhibitions/:id/like',
        async ({ client, account, params, set }) => {
          try {
            const project = await ProjectService.getProjectLike(params.id, {
              client,
              account: account ? account.id : undefined,
            });

            const message = `Like information was successfully received`;

            logger.info(message);

            return project.likes;
          } catch {
            const message =
              'An error occurred when receiving information about like';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(GetProjectLikeResponse),
          detail: {
            summary: 'Получить информацию о лайке у проекта по идентификатору',
            description:
              'Возвращает информацию о лайке у проекта по его идентификатору',
          },
        },
      ),
  )
  .guard((app) =>
    app
      .use(security)
      .get(
        '/',
        async ({ account, query, set }) => {
          try {
            const projects = await ProjectService.getUnpublishedProjects({
              userId: account.id,
              ...query,
            });

            const message = 'Projects have been successfully received';

            logger.info(message);

            return projects.map(({ partners, ...rest }) => ({
              ...rest,
              partners: partners.map((partner) => partner.partner),
            }));
          } catch {
            const message = 'An error occurred when receiving projects';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          query: GetProjectsQuery,
          response: response(GetProjectsResponse),
          detail: {
            summary: 'Получить список проектов авторизованного пользователя',
            description:
              'Возвращает список проектов авторизованного пользователя с краткой информацией',
          },
        },
      )
      .get(
        '/:id',
        async ({ account, params, set }) => {
          try {
            const project = await ProjectService.getProjectById(
              params.id,
              account.id,
            );

            const message = `Project with the ID ${project.id} received successfully`;

            logger.info(message);

            const { partners, tags, ...rest } = project;

            return {
              ...rest,
              partners: partners.map((partner) => partner.partner),
              tags: tags.map((tag) => tag.tag),
            };
          } catch (error) {
            if (error instanceof NotFoundError) {
              const message = error.message;

              logger.warn(message);

              set.status = 404;
              throw new Error(message);
            }

            const message = 'An error occurred when receiving the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(GetProjectResponse),
          detail: {
            summary:
              'Получить проект авторизованного пользователя по идентификатору',
            description:
              'Возвращает полную информацию о конкретном проекте авторизованного пользователя по его идентификатору',
          },
        },
      )
      .post(
        '/',
        async ({ account, set }) => {
          try {
            const project = await ProjectService.createProject(account.id);

            const message = `Project with the ID ${project.id} has been successfully created`;

            logger.info(message);

            return project;
          } catch {
            const message = 'An error occurred when creating the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(CreateProjectResponse),
          detail: {
            summary: 'Создать новый проект',
            description:
              'Создаёт пустой проект для авторизованного пользователя',
          },
        },
      )
      .post(
        '/:id/publish',
        async ({ account, params, set }) => {
          try {
            const project = await ProjectService.publishProject(
              params.id,
              account.id,
            );

            const message = `Project with the ID ${project.id} has been successfully published`;

            logger.info(message);

            const { partners, tags, ...rest } = project;

            return {
              ...rest,
              partners: partners.map((partner) => partner.partner),
              tags: tags.map((tag) => tag.tag),
            };
          } catch (error) {
            if (error instanceof NotFoundError) {
              const message = error.message;

              logger.warn(message);

              set.status = 404;
              throw new Error(message);
            }

            if (error instanceof BadRequestError) {
              const message = error.message;

              logger.warn(message);

              set.status = 400;
              throw new Error(message);
            }

            const message = 'An error occurred when publishing the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(PublishProjectResponse),
          detail: {
            summary: 'Опубликовать проект',
            description: 'Опубликовывает проект по его идентификатору',
          },
        },
      )
      .post(
        '/:id/unpublish',
        async ({ account, params, set }) => {
          try {
            const project = await ProjectService.unpublishProject(
              params.id,
              account.id,
            );

            const message = `Project with the ID ${project.id} has been successfully unpublished`;

            logger.info(message);

            const { partners, tags, ...rest } = project;

            return {
              ...rest,
              partners: partners.map((partner) => partner.partner),
              tags: tags.map((tag) => tag.tag),
            };
          } catch (error) {
            if (error instanceof NotFoundError) {
              const message = error.message;

              logger.warn(message);

              set.status = 404;
              throw new Error(message);
            }

            if (error instanceof BadRequestError) {
              const message = error.message;

              logger.warn(message);

              set.status = 400;
              throw new Error(message);
            }

            const message = 'An error occurred when unpublishing the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(UnpublishProjectResponse),
          detail: {
            summary: 'Отменить публикацию проекта',
            description: 'Отменяет публикацию проекта по его идентификатору',
          },
        },
      )
      .put(
        '/:id',
        async ({ account, params, body, set }) => {
          try {
            const project = await ProjectService.updateProject(
              params.id,
              account.id,
              body,
            );

            const message = `Project with the ID ${project.id} has been successfully updated`;

            logger.info(message);

            const { partners, tags, ...rest } = project;

            return {
              ...rest,
              partners: partners.map((partner) => partner.partner),
              tags: tags.map((tag) => tag.tag),
            };
          } catch {
            const message = 'An error occurred when updating the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          body: UpdateProjectBody,
          response: response(UpdateProjectResponse),
          detail: {
            summary: 'Обновить проект',
            description: 'Обновляет проект с новыми данными',
          },
        },
      )
      .delete(
        '/:id',
        async ({ account, params, set }) => {
          try {
            const project = await ProjectService.deleteProject(
              params.id,
              account.id,
            );

            const message = `Project with the ID ${project.id} successfully deleted`;

            logger.info(message);

            return project;
          } catch {
            const message = 'An error occurred when deleting the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          response: response(DeleteProjectResponse),
          detail: {
            summary: 'Удалить проект по идентификатору',
            description: 'Безвозвратно удаляет проект по его идентификатору',
          },
        },
      )
      .get(
        '/for-review',
        async ({ query, set }) => {
          try {
            const projects = await ProjectService.getProjectsForReview(query);

            const message =
              'Projects for review have been successfully received';

            logger.info(message);

            return projects.map(({ partners, ...rest }) => ({
              ...rest,
              partners: partners.map((partner) => partner.partner),
            }));
          } catch {
            const message =
              'An error occurred when receiving projects for review';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          query: GetProjectsForReviewQuery,
          response: response(GetProjectsForReviewResponse),
          detail: {
            summary: 'Получить список проектов для проверки',
            description:
              'Возвращает список проектов для проверки с краткой информацией',
          },
        },
      )
      .get(
        '/for-review/:id',
        async ({ params, set }) => {
          try {
            const project = await ProjectService.getProjectForReview(params.id);

            const message =
              'Project for review have been successfully received';

            logger.info(message);

            const { partners, tags, ...rest } = project;

            return {
              ...rest,
              partners: partners.map((partner) => partner.partner),
              tags: tags.map((tag) => tag.tag),
            };
          } catch {
            const message =
              'An error occurred when receiving project for review';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(GetProjectForReviewResponse),
          detail: {
            summary: 'Получить проект для проверки',
            description: 'Возвращает проект для проверки',
          },
        },
      )
      .post(
        '/:id/approve',
        async ({ params, set }) => {
          try {
            const project = await ProjectService.approveProject(params.id);

            await NotificationService.createNotification(project.author.id, {
              title: 'Ваш проект был одобрен!',
              content: `Ваш проект: ${project.title} был одобрен администрацией`,
              link: `/projects/${project.id}`,
            });

            const message = `Project with the ID ${project.id} has been successfully approved`;

            logger.info(message);

            return project;
          } catch {
            const message = 'An error occurred when approving the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          response: response(ApproveProjectResponse),
          detail: {
            summary: 'Одобрить проект',
            description: 'Одобряет проект по его идентификатору',
          },
        },
      )
      .post(
        '/:id/reject',
        async ({ params, body, set }) => {
          try {
            const project = await ProjectService.rejectProject(params.id, body);

            await NotificationService.createNotification(project.author.id, {
              title: 'Ваш проект был отклонён!',
              content: `Ваш проект: ${project.title} был отклонён администрацией`,
              link: `/projects/${project.id}/edit`,
            });

            const message = `Project with the ID ${project.id} has been successfully rejected`;

            logger.info(message);

            return project;
          } catch {
            const message = 'An error occurred when rejecting the project';

            logger.error(message);

            set.status = 500;
            throw new Error(message);
          }
        },
        {
          useRoles: {
            roles: ['admin'],
          },
          body: RejectProjectBody,
          response: response(RejectProjectResponse),
          detail: {
            summary: 'Отклонить проект',
            description: 'Отклоняет проект по его идентификатору',
          },
        },
      ),
  );
