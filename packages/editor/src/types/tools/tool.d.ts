import type { API } from '@/types';
import type { ToolConfig } from '@/types/tools/tool-config';
import type { SanitizerConfig } from '@/types/configs/sanitizer-config';

export type BaseTool<RenderReturnType = HTMLElement> = {
  render(): RenderReturnType | Promise<RenderReturnType>;
};

export type BaseToolConstructorOptions<C extends object = any> = {
  api: API;
  config?: ToolConfig<C>;
};

export type BaseToolConstructable = {
  isInline?: boolean;
  sanitize?: SanitizerConfig;
  title?: string;
  prepare?(data: {
    toolName: string;
    config: ToolConfig;
  }): void | Promise<void>;
  reset?(): void | Promise<void>;
};
