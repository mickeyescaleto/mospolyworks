import { t } from 'elysia';

export const tDeleteDraftParams = t.Object({
  draftId: t.String(),
});

export const tDeleteDraftResponse = t.String();
