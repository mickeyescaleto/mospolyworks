import { Elysia, t } from 'elysia';

import { getLogger } from '@/utilities/logger';
import { StorageService } from '@/modules/storage/storage.service';

const logger = getLogger('Storage');

export const storage = new Elysia({
  prefix: '/storage',
  tags: ['Хранилище'],
})
  .post(
    '/upload-by-file',
    async ({ body }) => {
      return {
        success: 1,
        file: {
          url: await StorageService.save(body.file),
        },
      };
    },
    {
      body: t.Object({ file: t.File() }),
    },
  )
  .post(
    '/file/upload-by-file',
    async ({ body }) => {
      return {
        success: 1,
        file: {
          url: await StorageService.save(body.file),
          size: body.file.size,
          name: body.file.name,
          extension: body.file.name.split('.').pop(),
        },
      };
    },
    {
      body: t.Object({ file: t.File() }),
    },
  );
