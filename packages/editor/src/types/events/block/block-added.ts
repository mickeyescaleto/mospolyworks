import type { BlockMutationEventDetail } from '@/types/events/block/base';

export const BlockAddedMutationType = 'block-added';

type BlockAddedEventDetail = BlockMutationEventDetail & {
  index: number;
};

export type BlockAddedEvent = CustomEvent<BlockAddedEventDetail>;
