import { Elysia, NotFoundError } from 'elysia';

import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { TagService } from '@/modules/tag/tag.service';
import { tGetTagParams, tGetTagResponse } from '@/modules/tag/schemas/get-tag';

const logger = getLogger('Tags');

export const tags = new Elysia({
  prefix: '/tags',
  tags: ['Tags'],
}).get(
  '/:tagId',
  async ({ params, error }) => {
    try {
      const tag = await TagService.getTag(params.tagId);

      const message = `Tag with the ID ${tag.id} received successfully`;

      logger.info(message);

      return tag;
    } catch (e) {
      if (e instanceof NotFoundError) {
        const message = e.message;

        logger.warn(message);

        return error('Not Found', { message });
      }

      const message = 'An error occurred when receiving the tag';

      logger.error(message);

      return error('Internal Server Error', { message });
    }
  },
  {
    params: tGetTagParams,
    response: {
      200: tGetTagResponse,
      404: tError,
      500: tError,
    },
    detail: {
      summary: 'Get tag by ID',
      description: 'Returns detailed information about a specific tag',
    },
  },
);
