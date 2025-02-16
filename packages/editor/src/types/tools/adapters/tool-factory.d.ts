import type { BlockToolAdapter } from '@repo/editor/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter } from '@repo/editor/types/tools/adapters/block-tune-adapter';
import type { InlineToolAdapter } from '@repo/editor/types/tools/adapters/inline-tool-adapter';

export type ToolFactory =
  | BlockToolAdapter
  | InlineToolAdapter
  | BlockTuneAdapter;
