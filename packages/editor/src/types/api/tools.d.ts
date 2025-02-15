import type { BlockToolAdapter } from '@/types/tools/adapters/block-tool-adapter';

export type Tools = {
  getBlockTools(): BlockToolAdapter[];
};
