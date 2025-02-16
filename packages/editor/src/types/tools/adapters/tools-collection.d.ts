import type { BlockToolAdapter } from '@repo/editor/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter } from '@repo/editor/types/tools/adapters/block-tune-adapter';
import type { InlineToolAdapter } from '@repo/editor/types/tools/adapters/inline-tool-adapter';
import type { ToolFactory } from '@repo/editor/types/tools/adapters/tool-factory';

export type ToolsCollection<V extends ToolFactory = ToolFactory> = {
  blockTools: ToolsCollection<BlockToolAdapter>;
  inlineTools: ToolsCollection<InlineToolAdapter>;
  blockTunes: ToolsCollection<BlockTuneAdapter>;
  internalTools: ToolsCollection<V>;
  externalTools: ToolsCollection<V>;
};
