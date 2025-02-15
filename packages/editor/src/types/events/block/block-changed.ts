import type { BlockMutationEventDetail } from '@/types/events/block/base';

export const BlockChangedMutationType = 'block-changed';

type BlockChangedEventDetail = BlockMutationEventDetail & {
  index: number;
};

export type BlockChangedEvent = CustomEvent<BlockChangedEventDetail>;
