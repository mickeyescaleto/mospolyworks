import { Elysia, NotFoundError } from 'elysia';

import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { ProjectService } from '@/modules/project/project.service';
import {
  tGetProjectParams,
  tGetProjectResponse,
} from '@/modules/project/schemas/get-project';
import {
  tGetExhibitionProjectsQuery,
  tGetExhibitionProjectsResponse,
} from '@/modules/project/schemas/get-exhibition-projects';

const logger = getLogger('Projects');

export const projects = new Elysia({
  prefix: '/projects',
  tags: ['Projects'],
})
  .get(
    '/:projectId',
    async ({ params, error }) => {
      try {
        const project = await ProjectService.getProject(params.projectId);

        const message = `Project with the ID ${project.id} received successfully`;

        logger.info(message);

        return project;
      } catch (e) {
        if (e instanceof NotFoundError) {
          const message = e.message;

          logger.warn(message);

          return error('Not Found', { message });
        }

        const message = 'An error occurred when receiving the project';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      params: tGetProjectParams,
      response: {
        200: tGetProjectResponse,
        404: tError,
        500: tError,
      },
      detail: {
        summary: 'Get project by ID',
        description: 'Returns full project details',
      },
    },
  )
  .get(
    '/exhibitions',
    async ({ query, error }) => {
      try {
        const projects = await ProjectService.getExhibitionProjects(query);

        const message = 'Projects have been successfully received';

        logger.info(message);

        return projects;
      } catch {
        const message = 'An error occurred when receiving projects';

        logger.error(message);

        return error('Internal Server Error', { message });
      }
    },
    {
      query: tGetExhibitionProjectsQuery,
      response: {
        200: tGetExhibitionProjectsResponse,
        500: tError,
      },
      detail: {
        summary: 'List exhibition projects',
        description:
          'Returns list of exhibition projects featured with filtering options',
      },
    },
  );
