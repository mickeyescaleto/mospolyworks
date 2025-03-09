import { Elysia } from 'elysia';

import { ProjectService } from '@/services/project';
import { tGetExhibitionProjects } from '@/schemas/project';

export const projects = new Elysia({
  name: 'routes.projects',
  prefix: '/projects',
})
  .decorate({
    projectService: new ProjectService(),
  })
  .get(
    '/exhibition',
    async ({ query, projectService }) => {
      const projects = await projectService.getExhibitionProjects(query);

      return projects;
    },
    {
      query: tGetExhibitionProjects,
    },
  );
