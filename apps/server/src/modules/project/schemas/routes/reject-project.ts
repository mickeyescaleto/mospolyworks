import { t } from 'elysia';

import { Project } from '@/modules/project/schemas/project';

export const RejectProjectBody = t.Pick(Project, ['rejectionComment']);

export type IRejectProjectBody = typeof RejectProjectBody.static;

export const RejectProjectResponse = t.Pick(Project, ['id']);
