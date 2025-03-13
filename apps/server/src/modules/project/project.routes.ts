import { Elysia } from 'elysia';

import { ProjectService } from '@/modules/project/project.service';
import {
  tGetExhibitionProjectsQuery,
  tGetExhibitionProjectsResponse,
} from '@/modules/project/schemas/get-exhibition-projects';

export const projects = new Elysia({
  prefix: '/projects',
  tags: ['projects'],
}).get(
  '/exhibition',
  async ({ query }) => {
    return await ProjectService.getExhibitionProjects(query);
  },
  {
    query: tGetExhibitionProjectsQuery,
    response: {
      200: tGetExhibitionProjectsResponse,
    },
  },
);
