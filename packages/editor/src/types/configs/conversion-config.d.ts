import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';

export type ConversionConfig = {
  import?: ((data: string, config: ToolConfig) => BlockToolData) | string;
  export?: ((data: BlockToolData) => string) | string;
};
