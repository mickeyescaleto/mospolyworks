import type BlockToolAdapter from '@/components/tools/block';
import type InlineToolAdapter from '@/components/tools/inline';
import type BlockTuneAdapter from '@/components/tools/tune';

import type { ToolsCollection as ToolsCollectionInterface } from '@/types/tools/adapters/tools-collection';

export type ToolClass = BlockToolAdapter | InlineToolAdapter | BlockTuneAdapter;

export default class ToolsCollection<V extends ToolClass = ToolClass>
  extends Map<string, V>
  implements ToolsCollectionInterface<V>
{
  public get blockTools(): ToolsCollection<BlockToolAdapter> {
    const tools = Array.from(this.entries()).filter(([, tool]) =>
      tool.isBlock(),
    ) as [string, BlockToolAdapter][];

    return new ToolsCollection<BlockToolAdapter>(tools);
  }

  public get inlineTools(): ToolsCollection<InlineToolAdapter> {
    const tools = Array.from(this.entries()).filter(([, tool]) =>
      tool.isInline(),
    ) as [string, InlineToolAdapter][];

    return new ToolsCollection<InlineToolAdapter>(tools);
  }

  public get blockTunes(): ToolsCollection<BlockTuneAdapter> {
    const tools = Array.from(this.entries()).filter(([, tool]) =>
      tool.isTune(),
    ) as [string, BlockTuneAdapter][];

    return new ToolsCollection<BlockTuneAdapter>(tools);
  }

  public get internalTools(): ToolsCollection<V> {
    const tools = Array.from(this.entries()).filter(
      ([, tool]) => tool.isInternal,
    );

    return new ToolsCollection<V>(tools);
  }

  public get externalTools(): ToolsCollection<V> {
    const tools = Array.from(this.entries()).filter(
      ([, tool]) => !tool.isInternal,
    );

    return new ToolsCollection<V>(tools);
  }
}
