import { ToolType } from '@/types/tools/adapters/tool-type';
import type { InlineTool } from '@/types/tools/inline-tool';
import type { BaseToolAdapter } from '@/types/tools/adapters/base-tool-adapter';

export type InlineToolAdapter = BaseToolAdapter<ToolType.Inline, InlineTool> & {
  title: string;
  create(): InlineTool;
};
