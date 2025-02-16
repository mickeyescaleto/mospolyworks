import type { BlockToolAdapter } from '@repo/editor/types/tools/adapters/block-tool-adapter';

export type Tools = {
  getBlockTools(): BlockToolAdapter[];
};
