import Module from '@/components/__module';

import type { Tools } from '@/types/api/tools';

export default class ToolsAPI extends Module {
  public get methods(): Tools {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values()),
    };
  }
}
