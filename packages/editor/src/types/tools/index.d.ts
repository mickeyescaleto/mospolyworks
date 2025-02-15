import { BlockTool, BlockToolConstructable } from '@/types/tools/block-tool';
import { InlineTool, InlineToolConstructable } from '@/types/tools/inline-tool';
import {
  BlockTune,
  BlockTuneConstructable,
} from '@/types/block-tunes/block-tune';

export type Tool = BlockTool | InlineTool | BlockTune;

export type ToolConstructable =
  | BlockToolConstructable
  | InlineToolConstructable
  | BlockTuneConstructable;
