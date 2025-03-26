import { t } from 'elysia';

export const tCreateAnonymousLikeParams = t.Object({
  projectId: t.String(),
});

export const tCreateAnonymousLikeResponse = t.String();
