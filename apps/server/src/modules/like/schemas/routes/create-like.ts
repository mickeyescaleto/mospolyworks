import { t } from 'elysia';

export const CreateLikeBody = t.Object({
  projectId: t.String(),
});

export const CreateLikeResponse = t.String();
