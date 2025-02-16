import {
  BlockTool,
  BlockToolConstructable,
} from '@repo/editor/types/tools/block-tool';
import {
  InlineTool,
  InlineToolConstructable,
} from '@repo/editor/types/tools/inline-tool';
import {
  BlockTune,
  BlockTuneConstructable,
} from '@repo/editor/types/block-tunes/block-tune';

export type Tool = BlockTool | InlineTool | BlockTune;

export type ToolConstructable =
  | BlockToolConstructable
  | InlineToolConstructable
  | BlockTuneConstructable;
