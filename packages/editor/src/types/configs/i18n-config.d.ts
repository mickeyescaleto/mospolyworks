import type { I18nDictionary } from '@repo/editor/types/configs/i18n-dictionary';

export type I18nConfig = {
  messages?: I18nDictionary;
  direction?: 'ltr' | 'rtl';
};
