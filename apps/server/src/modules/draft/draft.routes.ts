import { Elysia, NotFoundError } from 'elysia';

import { BadRequestError } from '@/errors/bad-request';
import { tError } from '@/schemas/error';
import { getLogger } from '@/utilities/logger';
import { security } from '@/plugins/security';
import { DraftService } from '@/modules/draft/draft.service';
import { tGetDraftsResponse } from '@/modules/draft/schemas/get-drafts';
import {
  tGetDraftParams,
  tGetDraftResponse,
} from '@/modules/draft/schemas/get-draft';
import { tCreateDraftResponse } from '@/modules/draft/schemas/create-draft';
import {
  tUpdateDraftBody,
  tUpdateDraftParams,
  tUpdateDraftResponse,
} from '@/modules/draft/schemas/update-draft';
import {
  tDeleteDraftParams,
  tDeleteDraftResponse,
} from '@/modules/draft/schemas/delete-draft';
import {
  tPublishDraftParams,
  tPublishDraftResponse,
} from '@/modules/draft/schemas/publish-draft';

const logger = getLogger('Drafts');

export const drafts = new Elysia({
  prefix: '/drafts',
  tags: ['Drafts'],
}).guard((app) =>
  app
    .use(security)
    .get(
      '/',
      async ({ user, error }) => {
        try {
          const drafts = await DraftService.getDrafts(user.id);

          const message = `Drafts of the author with ID ${user.id} have been successfully received`;

          logger.info(message);

          return drafts;
        } catch {
          const message = 'An error occurred when receiving drafts';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        response: {
          200: tGetDraftsResponse,
          500: tError,
        },
        detail: {
          summary: `Get user's drafts`,
          description: 'Returns all drafts belonging to the authenticated user',
        },
      },
    )
    .get(
      '/:draftId',
      async ({ params, user, error }) => {
        try {
          const draft = await DraftService.getDraft(params.draftId, user.id);

          const message = `Draft with the ID ${draft.id} received successfully`;

          logger.info(message);

          return draft;
        } catch (e) {
          if (e instanceof NotFoundError) {
            const message = e.message;

            logger.warn(message);

            return error('Not Found', { message });
          }

          const message = 'An error occurred when receiving the draft';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tGetDraftParams,
        response: {
          200: tGetDraftResponse,
          404: tError,
          500: tError,
        },
        detail: {
          summary: `Get draft by ID`,
          description: 'Returns full content of a specific draft',
        },
      },
    )
    .post(
      '/',
      async ({ user, error }) => {
        try {
          const draft = await DraftService.createDraft(user.id);

          const message = `Draft with the ID ${draft.id} has been successfully created`;

          logger.info(message);

          return draft;
        } catch {
          const message = 'An error occurred when creating the draft';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        response: {
          200: tCreateDraftResponse,
          500: tError,
        },
        detail: {
          summary: `Create new draft`,
          description: 'Creates a new empty draft for the authenticated user',
        },
      },
    )
    .put(
      '/:draftId',
      async ({ params, body, user, error }) => {
        try {
          const draft = await DraftService.updateDraft(
            params.draftId,
            user.id,
            body,
          );

          const message = `Draft with the ID ${draft.id} has been successfully updated`;

          logger.info(message);

          return draft;
        } catch {
          const message = 'An error occurred when updating the draft';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tUpdateDraftParams,
        body: tUpdateDraftBody,
        response: {
          200: tUpdateDraftResponse,
          500: tError,
        },
        detail: {
          summary: `Update draft`,
          description: 'Fully replaces draft content with provided data',
        },
      },
    )
    .delete(
      '/:draftId',
      async ({ params, user, error }) => {
        try {
          const draft = await DraftService.deleteDraft(params.draftId, user.id);

          const message = `Draft with the ID ${draft.id} successfully deleted`;

          logger.info(message);

          return message;
        } catch {
          const message = 'An error occurred when deleting the draft';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tDeleteDraftParams,
        response: {
          200: tDeleteDraftResponse,
          500: tError,
        },
        detail: {
          summary: `Delete draft`,
          description: 'Permanently removes draft',
        },
      },
    )
    .post(
      '/:draftId/publish',
      async ({ params, user, error }) => {
        try {
          const project = await DraftService.publishDraft(
            params.draftId,
            user.id,
          );

          const message = `Draft with the ID ${project.id} successfully published`;

          logger.info(message);

          return project;
        } catch (e) {
          if (e instanceof NotFoundError) {
            const message = e.message;

            logger.warn(message);

            return error('Not Found', { message });
          }

          if (e instanceof BadRequestError) {
            const message = e.message;

            logger.warn(message);

            return error('Bad Request', { message });
          }

          const message = 'An error occurred when publishing the draft';

          logger.error(message);

          return error('Internal Server Error', { message });
        }
      },
      {
        params: tPublishDraftParams,
        response: {
          200: tPublishDraftResponse,
          400: tError,
          404: tError,
          500: tError,
        },
        detail: {
          summary: `Publish draft`,
          description: 'Converts draft into a published project',
        },
      },
    ),
);
