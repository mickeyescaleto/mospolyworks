import type { API } from '@repo/editor/types';
import type {
  BaseTool,
  BaseToolConstructable,
} from '@repo/editor/types/tools/tool';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { MenuConfig } from '@repo/editor/types/tools/menu-config';

export type InlineTool = BaseTool<HTMLElement | MenuConfig> & {
  shortcut?: string;
  surround?(range: Range | null): void;
  checkState?(selection: Selection): boolean;
  renderActions?(): HTMLElement;
  clear?(): void;
};

export type InlineToolConstructorOptions = {
  api: API;
  config?: ToolConfig;
};

export type InlineToolConstructable = BaseToolConstructable & {
  new (config: InlineToolConstructorOptions): BaseTool;
  isReadOnlySupported?: boolean;
};
