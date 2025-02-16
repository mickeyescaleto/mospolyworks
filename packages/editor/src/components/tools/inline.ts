import BaseToolAdapter, {
  InternalInlineToolSettings,
} from '@repo/editor/components/tools/base';
import { ToolType } from '@repo/editor/types/tools/adapters/tool-type';

import type { InlineToolAdapter as InlineToolAdapterInterface } from '@repo/editor/types/tools/adapters/inline-tool-adapter';
import type {
  InlineTool,
  InlineToolConstructable,
} from '@repo/editor/types/tools/inline-tool';

export default class InlineToolAdapter
  extends BaseToolAdapter<ToolType.Inline, InlineTool>
  implements InlineToolAdapterInterface
{
  public type: ToolType.Inline = ToolType.Inline;

  protected constructable: InlineToolConstructable;

  public get title(): string {
    return this.constructable[InternalInlineToolSettings.Title];
  }

  public create(): InlineTool {
    return new this.constructable({
      api: this.api,
      config: this.settings,
    }) as InlineTool;
  }

  public get isReadOnlySupported(): boolean {
    return (
      this.constructable[InternalInlineToolSettings.IsReadOnlySupported] ??
      false
    );
  }
}
