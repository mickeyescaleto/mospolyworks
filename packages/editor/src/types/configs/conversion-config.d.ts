import type { BlockToolData } from '@/types/tools/block-tool-data';
import type { ToolConfig } from '@/types/tools/tool-config';

export type ConversionConfig = {
  import?: ((data: string, config: ToolConfig) => BlockToolData) | string;
  export?: ((data: BlockToolData) => string) | string;
};
