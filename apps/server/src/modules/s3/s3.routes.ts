import { Elysia } from 'elysia';

import { getLogger } from '@/utilities/logger';

const logger = getLogger('S3');

export const s3 = new Elysia({
  prefix: '/s3',
  tags: ['S3'],
});
