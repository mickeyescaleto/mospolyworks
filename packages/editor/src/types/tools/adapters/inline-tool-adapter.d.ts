import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';
import type { InlineTool } from '@repo/editor/types/tools/inline-tool';
import type { BaseToolAdapter } from '@repo/editor/types/tools/adapters/base-tool-adapter';

export type InlineToolAdapter = BaseToolAdapter<ToolType.Inline, InlineTool> & {
  title: string;
  create(): InlineTool;
};
