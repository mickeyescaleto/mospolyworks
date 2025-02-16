import type { BlockMutationEvent } from '@repo/editor/types/events/block';

export const BlockChanged = 'block changed';

export type BlockChangedPayload = {
  event: BlockMutationEvent;
};
