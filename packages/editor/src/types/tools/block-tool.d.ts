import type { ConversionConfig } from '@repo/editor/types/configs/conversion-config';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { PasteConfig } from '@repo/editor/types/configs/paste-config';
import type { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import type {
  BaseTool,
  BaseToolConstructable,
  BaseToolConstructorOptions,
} from '@repo/editor/types/tools/tool';
import type { BlockAPI } from '@repo/editor/types/api/block';
import type { ToolboxConfig } from '@repo/editor/types/tools/tool-settings';
import type { PasteEvent } from '@repo/editor/types/tools/paste-events';
import type { MoveEvent } from '@repo/editor/types/tools/hook-events';
import type { MenuConfig } from '@repo/editor/types/tools/menu-config';

export type BlockTool = BaseTool & {
  sanitize?: SanitizerConfig;
  save(block: HTMLElement): BlockToolData;
  renderSettings?(): HTMLElement | MenuConfig;
  validate?(blockData: BlockToolData): boolean;
  merge?(blockData: BlockToolData): void;
  onPaste?(event: PasteEvent): void;
  destroy?(): void;
  rendered?(): void;
  updated?(): void;
  removed?(): void;
  moved?(event: MoveEvent): void;
};

export type BlockToolConstructorOptions<
  D extends object = any,
  C extends object = any,
> = BaseToolConstructorOptions<C> & {
  data: BlockToolData<D>;
  block: BlockAPI;
  readOnly: boolean;
};

export type BlockToolConstructable = BaseToolConstructable & {
  toolbox?: ToolboxConfig;
  pasteConfig?: PasteConfig | false;
  conversionConfig?: ConversionConfig;
  isReadOnlySupported?: boolean;
  new (config: BlockToolConstructorOptions): BlockTool;
};
