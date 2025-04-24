import { swagger } from '@elysiajs/swagger';

export const documentation = swagger({
  path: '/v1/swagger',
  documentation: {
    info: {
      title: 'mospolyworks',
      version: '1.0.0',
      description: 'API документация для ресурса mospolyworks',
    },
    tags: [
      { name: 'Учётные записи', description: 'Маршруты учетных записей' },
      { name: 'Уведомления', description: 'Маршруты уведомлений' },
      { name: 'Пользователи', description: 'Маршруты пользователей' },
      { name: 'Категории', description: 'Маршруты категорий' },
      { name: 'Теги', description: 'Маршруты тегов' },
      { name: 'Проекты', description: 'Маршруты проектов' },
      { name: 'Лайки', description: 'Маршруты лайков' },
      { name: 'Жалобы', description: 'Маршруты жалоб' },
      { name: 'Хранилище', description: 'Маршруты хранилища' },
    ],
    components: {
      securitySchemes: {
        AccessToken: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
        RefreshToken: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refresh_token',
        },
      },
    },
  },
});
