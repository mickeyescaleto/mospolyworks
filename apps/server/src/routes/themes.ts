import { Elysia } from 'elysia';

import { ThemeService } from '@/services/theme';

export const themes = new Elysia({
  name: 'routes.themes',
  prefix: '/themes',
})
  .decorate({
    themeService: new ThemeService(),
  })
  .get('/exhibition', async ({ themeService }) => {
    const themes = await themeService.getExhibitionThemes();

    return themes;
  });
