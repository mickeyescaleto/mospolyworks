import {
  type BlockAddedEvent,
  BlockAddedMutationType,
} from '@repo/editor/types/events/block/block-added';
import {
  type BlockChangedEvent,
  BlockChangedMutationType,
} from '@repo/editor/types/events/block/block-changed';
import {
  type BlockMovedEvent,
  BlockMovedMutationType,
} from '@repo/editor/types/events/block/block-moved';
import {
  type BlockRemovedEvent,
  BlockRemovedMutationType,
} from '@repo/editor/types/events/block/block-removed';

export type BlockMutationEventMap = {
  [BlockAddedMutationType]: BlockAddedEvent;
  [BlockRemovedMutationType]: BlockRemovedEvent;
  [BlockMovedMutationType]: BlockMovedEvent;
  [BlockChangedMutationType]: BlockChangedEvent;
};

export type BlockMutationType = keyof BlockMutationEventMap;

type ValueOf<T> = T[keyof T];

export type BlockMutationEvent = ValueOf<BlockMutationEventMap>;
