import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';

const logger = getLogger('Reports');

export const reports = new Elysia({
  prefix: '/reports',
  tags: ['Reports'],
});
