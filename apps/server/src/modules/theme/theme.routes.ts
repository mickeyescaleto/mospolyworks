import { Elysia } from 'elysia';

import { ThemeService } from '@/modules/theme/theme.service';
import { tGetExhibitionThemesResponse } from '@/modules/theme/schemas/get-exhibition-themes';

export const themes = new Elysia({
  prefix: '/themes',
  tags: ['themes'],
}).get(
  '/exhibition',
  async () => {
    return await ThemeService.getExhibitionThemes();
  },
  {
    response: {
      200: tGetExhibitionThemesResponse,
    },
  },
);
