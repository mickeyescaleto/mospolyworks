import type { BlockMutationEventDetail } from '@repo/editor/types/events/block/base';

export const BlockAddedMutationType = 'block-added';

type BlockAddedEventDetail = BlockMutationEventDetail & {
  index: number;
};

export type BlockAddedEvent = CustomEvent<BlockAddedEventDetail>;
