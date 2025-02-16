import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type { BlockTune } from '@repo/editor/types/block-tunes/block-tune';
import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';
import type { BaseToolAdapter } from '@repo/editor/types/tools/adapters/base-tool-adapter';

export type BlockTuneAdapter = BaseToolAdapter<ToolType.Tune, BlockTune> & {
  create(data: BlockTuneData, block: BlockAPI): BlockTune;
};
