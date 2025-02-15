import { isObject, isString } from '@/components/utilities';
import defaultDictionary from '@/components/i18n/locales/ru/messages.json';

import type { DictNamespaces } from '@/types-internal/i18n-internal-namespace';

function getNamespaces(
  dict: object,
  keyPath?: string,
): DictNamespaces<typeof defaultDictionary> {
  const result = {};

  Object.entries(dict).forEach(([key, section]) => {
    if (isObject(section)) {
      const newPath = keyPath ? `${keyPath}.${key}` : key;

      const isLastSection = Object.values(section).every((sectionValue) => {
        return isString(sectionValue);
      });

      if (isLastSection) {
        result[key] = newPath;
      } else {
        result[key] = getNamespaces(section, newPath);
      }

      return;
    }

    result[key] = section;
  });

  return result as DictNamespaces<typeof defaultDictionary>;
}

export const I18nInternalNS = getNamespaces(defaultDictionary);
