import { IconItalic } from '@codexteam/icons';

import type { MenuConfig } from '@repo/editor/types/tools/menu-config';
import type { InlineTool } from '@repo/editor/types/tools/inline-tool';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export default class ItalicInlineTool implements InlineTool {
  public static isInline = true;

  public static title = 'Italic';

  private readonly commandName: string = 'italic';

  public render(): MenuConfig {
    return {
      icon: IconItalic,
      name: 'italic',
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName),
    };
  }

  public static get sanitize(): SanitizerConfig {
    return {
      i: {},
    } as SanitizerConfig;
  }

  public get shortcut(): string {
    return 'CMD+I';
  }
}
