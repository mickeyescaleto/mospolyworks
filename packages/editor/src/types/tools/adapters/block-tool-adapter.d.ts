import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';
import type { ToolsCollection } from '@repo/editor/types/tools/adapters/tools-collection';
import type { InlineToolAdapter } from '@repo/editor/types/tools/adapters/inline-tool-adapter';
import type { BlockTuneAdapter } from '@repo/editor/types/tools/adapters/block-tune-adapter';
import type { BlockTool } from '@repo/editor/types/tools/block-tool';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type { ToolboxConfigEntry } from '@repo/editor/types/tools/tool-settings';
import type { ConversionConfig } from '@repo/editor/types/configs/conversion-config';
import type { PasteConfig } from '@repo/editor/types/configs/paste-config';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { BaseToolAdapter } from '@repo/editor/types/tools/adapters/base-tool-adapter';

export type BlockToolAdapter = BaseToolAdapter<ToolType.Block, BlockTool> & {
  inlineTools: ToolsCollection<InlineToolAdapter>;
  tunes: ToolsCollection<BlockTuneAdapter>;
  create(data: BlockToolData, block: BlockAPI, readOnly: boolean): BlockTool;
  isReadOnlySupported: boolean;
  isLineBreaksEnabled: boolean;
  toolbox: ToolboxConfigEntry[] | undefined;
  conversionConfig: ConversionConfig | undefined;
  enabledInlineTools: boolean | string[];
  enabledBlockTunes: boolean | string[];
  pasteConfig: PasteConfig;
  sanitizeConfig: SanitizerConfig;
  baseSanitizeConfig: SanitizerConfig;
};
