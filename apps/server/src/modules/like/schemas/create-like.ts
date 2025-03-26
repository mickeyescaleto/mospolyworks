import { t } from 'elysia';

export const tCreateLikeParams = t.Object({
  projectId: t.String(),
});

export const tCreateLikeResponse = t.String();
