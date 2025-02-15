import Module from '@/components/__module';

import type { InlineToolbar } from '@/types/api/inline-toolbar';

export default class InlineToolbarAPI extends Module {
  public get methods(): InlineToolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
    };
  }

  public open(): void {
    this.Editor.InlineToolbar.tryToShow();
  }

  public close(): void {
    this.Editor.InlineToolbar.close();
  }
}
