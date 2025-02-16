import { IconBold } from '@codexteam/icons';

import type { MenuConfig } from '@repo/editor/types/tools/menu-config';
import type { InlineTool } from '@repo/editor/types/tools/inline-tool';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';

export default class BoldInlineTool implements InlineTool {
  public static isInline = true;

  public static title = 'Bold';

  public static get sanitize(): SanitizerConfig {
    return {
      b: {},
    } as SanitizerConfig;
  }

  private readonly commandName: string = 'bold';

  public render(): MenuConfig {
    return {
      icon: IconBold,
      name: 'bold',
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName),
    };
  }

  public get shortcut(): string {
    return 'CMD+B';
  }
}
