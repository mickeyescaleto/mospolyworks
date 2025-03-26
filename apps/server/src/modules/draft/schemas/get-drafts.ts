import { t } from 'elysia';

import { tDraft } from '@/modules/draft/schemas/draft';

export const tGetDraftsResponse = t.Array(
  t.Pick(tDraft, ['id', 'title', 'image']),
);
