import Module from '@/components/__module';

import type { Styles } from '@/types/api/styles';

export default class StylesAPI extends Module {
  public get classes(): Styles {
    return {
      block: 'cdx-block',
      inlineToolButton: 'ce-inline-tool',
      inlineToolButtonActive: 'ce-inline-tool--active',
      input: 'cdx-input',
      loader: 'cdx-loader',
      button: 'cdx-button',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  }
}
