import BaseToolAdapter from '@repo/editor/components/tools/base';
import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';

import type { BlockTuneData } from '@repo/editor/types/block-tunes/block-tune-data';
import type { BlockTuneAdapter as BlockTuneAdapterInterface } from '@repo/editor/types/tools/adapters/block-tune-adapter';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type {
  BlockTune,
  BlockTuneConstructable,
} from '@repo/editor/types/block-tunes/block-tune';

export default class BlockTuneAdapter
  extends BaseToolAdapter<ToolType.Tune, BlockTune>
  implements BlockTuneAdapterInterface
{
  public type: ToolType.Tune = ToolType.Tune;

  protected readonly constructable: BlockTuneConstructable;

  public create(data: BlockTuneData, block: BlockAPI): BlockTune {
    return new this.constructable({
      api: this.api,
      config: this.settings,
      block,
      data,
    });
  }
}
