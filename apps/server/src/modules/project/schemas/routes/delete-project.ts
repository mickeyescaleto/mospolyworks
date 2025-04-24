import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';

export const DeleteProjectResponse = t.Pick(Project, ['id']);
