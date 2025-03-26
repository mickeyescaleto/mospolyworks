import { t } from 'elysia';

export const tDeleteLikeParams = t.Object({
  projectId: t.String(),
});

export const tDeleteLikeResponse = t.String();
