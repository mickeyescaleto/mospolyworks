import type { BlockMutationEventDetail } from '@repo/editor/types/events/block/base';

export const BlockRemovedMutationType = 'block-removed';

type BlockRemovedEventDetail = BlockMutationEventDetail & {
  index: number;
};

export type BlockRemovedEvent = CustomEvent<BlockRemovedEventDetail>;
