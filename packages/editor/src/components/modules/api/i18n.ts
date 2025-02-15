import I18nInternal from '@/components/i18n';
import { logLabeled } from '@/components/utilities';
import Module from '@/components/__module';

import type { I18n } from '@/types/api/i18n';

export default class I18nAPI extends Module {
  private static getNamespace(toolName, isTune): string {
    if (isTune) {
      return `blockTunes.${toolName}`;
    }

    return `tools.${toolName}`;
  }

  public get methods(): I18n {
    return {
      t: (): string | undefined => {
        logLabeled('I18n.t() method can be accessed only from Tools', 'warn');

        return undefined;
      },
    };
  }

  public getMethodsForTool(toolName: string, isTune: boolean): I18n {
    return Object.assign(this.methods, {
      t: (dictKey: string): string => {
        return I18nInternal.t(I18nAPI.getNamespace(toolName, isTune), dictKey);
      },
    });
  }
}
