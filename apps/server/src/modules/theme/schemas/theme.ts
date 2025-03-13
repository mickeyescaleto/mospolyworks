import { t } from 'elysia';

export const tTheme = t.Object({
  id: t.String(),
  title: t.String(),
  isHidden: t.Boolean(),
});
