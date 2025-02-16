import type { BlockMutationEventDetail } from '@repo/editor/types/events/block/base';

export const BlockMovedMutationType = 'block-moved';

type BlockMovedEventDetail = BlockMutationEventDetail & {
  fromIndex: number;
  toIndex: number;
};

export type BlockMovedEvent = CustomEvent<BlockMovedEventDetail>;
