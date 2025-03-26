import { t } from 'elysia';

export const tDeleteAnonymousLikeParams = t.Object({
  projectId: t.String(),
});

export const tDeleteAnonymousLikeResponse = t.String();
