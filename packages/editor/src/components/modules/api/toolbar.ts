import Module from '@repo/editor/components/__module';
import * as utilities from '@repo/editor/components/utilities';

import type { Toolbar } from '@repo/editor/types/api/toolbar';

export default class ToolbarAPI extends Module {
  public get methods(): Toolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
      toggleBlockSettings: (openingState?: boolean): void =>
        this.toggleBlockSettings(openingState),
      toggleToolbox: (openingState?: boolean): void =>
        this.toggleToolbox(openingState),
    };
  }

  public open(): void {
    this.Editor.Toolbar.moveAndOpen();
  }

  public close(): void {
    this.Editor.Toolbar.close();
  }

  public toggleBlockSettings(openingState?: boolean): void {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      utilities.logLabeled(
        "Could't toggle the Toolbar because there is no block selected ",
        'warn',
      );

      return;
    }

    const canOpenBlockSettings =
      openingState ?? !this.Editor.BlockSettings.opened;

    if (canOpenBlockSettings) {
      this.Editor.Toolbar.moveAndOpen();
      this.Editor.BlockSettings.open();
    } else {
      this.Editor.BlockSettings.close();
    }
  }

  public toggleToolbox(openingState: boolean): void {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      utilities.logLabeled(
        "Could't toggle the Toolbox because there is no block selected ",
        'warn',
      );

      return;
    }

    const canOpenToolbox = openingState ?? !this.Editor.Toolbar.toolbox.opened;

    if (canOpenToolbox) {
      this.Editor.Toolbar.moveAndOpen();
      this.Editor.Toolbar.toolbox.open();
    } else {
      this.Editor.Toolbar.toolbox.close();
    }
  }
}
