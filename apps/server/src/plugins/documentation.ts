import { swagger } from '@elysiajs/swagger';

export const documentation = swagger({
  path: '/v1/swagger',
  documentation: {
    info: {
      title: 'mospolyworks documentation',
      version: '1.0.0',
      description: 'API Documentation',
    },
    tags: [
      { name: 'Accounts', description: 'Account routes' },
      { name: 'Notifications', description: 'Notification routes' },
      { name: 'Users', description: 'User routes' },
      { name: 'Categories', description: 'Category routes' },
      { name: 'Tags', description: 'Tag routes' },
      { name: 'Drafts', description: 'Draft routes' },
      { name: 'Projects', description: 'Project routes' },
      { name: 'Likes', description: 'Like routes' },
      { name: 'Reports', description: 'Report routes' },
      { name: 'S3', description: 'S3 routes' },
    ],
    components: {
      securitySchemes: {
        AccessTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
        RefreshTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refresh_token',
        },
      },
    },
  },
});
