import Module from '@repo/editor/components/__module';

import type { Tools } from '@repo/editor/types/api/tools';

export default class ToolsAPI extends Module {
  public get methods(): Tools {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values()),
    };
  }
}
