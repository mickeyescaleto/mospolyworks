import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';
import type { Tool } from '@repo/editor/types/tools';
import type { ToolSettings } from '@repo/editor/types/tools/tool-settings';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { InlineToolAdapter } from '@repo/editor/types/tools/adapters/inline-tool-adapter';
import type { BlockToolAdapter } from '@repo/editor/types/tools/adapters/block-tool-adapter';
import type { BlockTuneAdapter } from '@repo/editor/types/tools/adapters/block-tune-adapter';

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
