import type { BlockToolAdapter } from '@/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter } from '@/types/tools/adapters/block-tune-adapter';
import type { InlineToolAdapter } from '@/types/tools/adapters/inline-tool-adapter';

export type ToolFactory =
  | BlockToolAdapter
  | InlineToolAdapter
  | BlockTuneAdapter;
