import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';

export const ApproveProjectResponse = t.Pick(Project, ['id']);
