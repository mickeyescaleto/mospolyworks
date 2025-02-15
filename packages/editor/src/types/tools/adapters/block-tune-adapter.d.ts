import { ToolType } from '@/types/tools/adapters/tool-type';
import type { BlockAPI } from '@/types/api/block';
import type { BlockTune } from '@/types/block-tunes/block-tune';
import type { BlockTuneData } from '@/types/block-tunes/block-tune-data';
import type { BaseToolAdapter } from '@/types/tools/adapters/base-tool-adapter';

export type BlockTuneAdapter = BaseToolAdapter<ToolType.Tune, BlockTune> & {
  create(data: BlockTuneData, block: BlockAPI): BlockTune;
};
