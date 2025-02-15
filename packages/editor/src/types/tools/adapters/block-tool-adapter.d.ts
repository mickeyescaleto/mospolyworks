import { ToolType } from '@/types/tools/adapters/tool-type';
import type { ToolsCollection } from '@/types/tools/adapters/tools-collection';
import type { InlineToolAdapter } from '@/types/tools/adapters/inline-tool-adapter';
import type { BlockTuneAdapter } from '@/types/tools/adapters/block-tune-adapter';
import type { BlockTool } from '@/types/tools/block-tool';
import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { BlockAPI } from '@/types/api/block';
import type { ToolboxConfigEntry } from '@/types/tools/tool-settings';
import type { ConversionConfig } from '@/types/configs/conversion-config';
import type { PasteConfig } from '@/types/configs/paste-config';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { BaseToolAdapter } from '@/types/tools/adapters/base-tool-adapter';

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
