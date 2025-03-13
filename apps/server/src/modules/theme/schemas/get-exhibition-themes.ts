import { t } from 'elysia';

import { tTheme } from '@/modules/theme/schemas/theme';
import { tTag } from '@/modules/tag/schemas/tag';

export const tGetExhibitionThemesResponse = t.Array(
  t.Composite([
    t.Pick(tTheme, ['id', 'title']),
    t.Object({
      tags: t.Array(t.Pick(tTag, ['id', 'title'])),
    }),
  ]),
);
