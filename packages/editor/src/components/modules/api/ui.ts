import Module from '@repo/editor/components/__module';

import type { Ui, UiNodes } from '@repo/editor/types/api/ui';

export default class UiAPI extends Module {
  public get methods(): Ui {
    return {
      nodes: this.editorNodes,
    };
  }

  private get editorNodes(): UiNodes {
    return {
      wrapper: this.Editor.UI.nodes.wrapper,
      redactor: this.Editor.UI.nodes.redactor,
    };
  }
}
