import { Elysia, t } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { StorageService } from '@/modules/storage/storage.service';

const logger = getLogger('Storage');

export const storage = new Elysia({
  prefix: '/storage',
  tags: ['Хранилище'],
}).post(
  '/upload-by-file',
  async ({ body }) => {
    return {
      success: 1,
      file: {
        url: await StorageService.save(body.file, 'test'),
      },
    };
  },
  {
    body: t.Object({ file: t.File() }),
  },
);
