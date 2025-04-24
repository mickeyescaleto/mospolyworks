import Module from '@repo/editor/components/__module';

import type { Styles } from '@repo/editor/types/api/styles';

export default class StylesAPI extends Module {
  public get classes(): Styles {
    return {
      block: 'cdx-block',
      inlineToolButton: 'editor-inline-tool',
      inlineToolButtonActive: 'editor-inline-tool--active',
      input: 'cdx-input',
      loader: 'cdx-loader',
      button: 'cdx-button',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  }
}
