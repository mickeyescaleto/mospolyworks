import { t } from 'elysia';

import { tDraft } from '@/modules/draft/schemas/draft';

export const tCreateDraftResponse = t.Pick(tDraft, ['id']);
