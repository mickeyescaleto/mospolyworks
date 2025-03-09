import { t } from 'elysia';

export const tGetExhibitionProjects = t.Object({
  search: t.Optional(t.String()),
  theme: t.Optional(t.String()),
  sort: t.Optional(
    t.Union([t.Literal('date'), t.Literal('rating'), t.Literal('verified')]),
  ),
});
