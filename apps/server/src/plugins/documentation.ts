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
      { name: 'auth', description: 'Authentication routes' },
      { name: 'users', description: 'User routes' },
      { name: 'projects', description: 'Project routes' },
      { name: 'themes', description: 'Theme routes' },
      { name: 'notifications', description: 'Notification routes' },
    ],
  },
});
