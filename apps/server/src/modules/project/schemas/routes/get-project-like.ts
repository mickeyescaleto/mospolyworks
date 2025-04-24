import { t } from 'elysia';

export const GetProjectLikeResponse = t.Array(
  t.Object({
    id: t.String(),
  }),
);
