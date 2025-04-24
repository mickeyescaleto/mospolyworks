import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';

export const CreateProjectResponse = t.Pick(Project, ['id']);
