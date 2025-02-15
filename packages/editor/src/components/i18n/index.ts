import defaultDictionary from '@/components/i18n/locales/ru/messages.json';

import type { LeavesDictKeys } from '@/types-internal/i18n-internal-namespace';
import type {
  I18nDictionary,
  Dictionary,
} from '@/types/configs/i18n-dictionary';

type DictKeys = LeavesDictKeys<typeof defaultDictionary>;

export default class I18n {
  private static currentDictionary: I18nDictionary = defaultDictionary;

  public static ui(internalNamespace: string, dictKey: DictKeys): string {
    return I18n._t(internalNamespace, dictKey);
  }

  public static t(namespace: string, dictKey: string): string {
    return I18n._t(namespace, dictKey);
  }

  public static setDictionary(dictionary: I18nDictionary): void {
    I18n.currentDictionary = dictionary;
  }

  private static _t(namespace: string, dictKey: string): string {
    const section = I18n.getNamespace(namespace);

    if (!section || !section[dictKey]) {
      return dictKey;
    }

    return section[dictKey] as string;
  }

  private static getNamespace(namespace: string): Dictionary {
    const parts = namespace.split('.');

    return parts.reduce((section, part) => {
      if (!section || !Object.keys(section).length) {
        return {};
      }

      return section[part];
    }, I18n.currentDictionary);
  }
}
