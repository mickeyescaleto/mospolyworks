import { IconItalic } from '@codexteam/icons';

import type { InlineTool } from '@repo/editor/types/tools/inline-tool';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export default class ItalicInlineTool implements InlineTool {
  public static isInline = true;

  public static title = 'Italic';

  public static get sanitize(): SanitizerConfig {
    return {
      i: {},
    } as SanitizerConfig;
  }

  private readonly commandName: string = 'italic';

  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--italic',
  };

  private nodes: { button: HTMLButtonElement } = {
    button: null,
  };

  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.innerHTML = IconItalic;

    return this.nodes.button;
  }

  public surround(): void {
    document.execCommand(this.commandName);
  }

  public checkState(): boolean {
    const isActive = document.queryCommandState(this.commandName);

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);

    return isActive;
  }

  public get shortcut(): string {
    return 'CMD+I';
  }
}
