import { ToolType } from '@/types/tools/adapters/tool-type';
import type { Tool } from '@/types/tools';
import type { ToolSettings } from '@/types/tools/tool-settings';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';
import type { InlineToolAdapter } from '@/types/tools/adapters/inline-tool-adapter';
import type { BlockToolAdapter } from '@/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter } from '@/types/tools/adapters/block-tune-adapter';

export type BaseToolAdapter<Type extends ToolType, ToolClass extends Tool> = {
  type: Type;
  name: string;
  readonly isInternal: boolean;
  readonly isDefault: boolean;
  settings: ToolSettings;
  reset(): void | Promise<void>;
  prepare(): void | Promise<void>;
  shortcut: string | undefined;
  sanitizeConfig: SanitizerConfig;
  isInline(): this is InlineToolAdapter;
  isBlock(): this is BlockToolAdapter;
  isTune(): this is BlockTuneAdapter;
  create(...args: any[]): ToolClass;
};
