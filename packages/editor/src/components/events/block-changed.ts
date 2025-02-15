import type { BlockMutationEvent } from '@/types/events/block';

export const BlockChanged = 'block changed';

export type BlockChangedPayload = {
  event: BlockMutationEvent;
};
