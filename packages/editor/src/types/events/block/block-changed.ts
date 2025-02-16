import type { BlockMutationEventDetail } from '@repo/editor/types/events/block/base';

export const BlockChangedMutationType = 'block-changed';

type BlockChangedEventDetail = BlockMutationEventDetail & {
  index: number;
};

export type BlockChangedEvent = CustomEvent<BlockChangedEventDetail>;
