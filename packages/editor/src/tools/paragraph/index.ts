import { IconText } from '@codexteam/icons';
import './styles.css';

import type { API } from '@repo/editor/types';
import type { ConversionConfig } from '@repo/editor/types/configs/conversion-config';
import type { HTMLPasteEvent } from '@repo/editor/types/tools/paste-events';
import type { PasteConfig } from '@repo/editor/types/configs/paste-config';
import type { SanitizerConfig } from '@repo/editor/types/configs/sanitizer-config';
import type { ToolConfig } from '@repo/editor/types/tools/tool-config';
import type { ToolboxConfig } from '@repo/editor/types/tools/tool-settings';

export type ParagraphConfig = ToolConfig & {
  placeholder?: string;
  preserveBlank?: boolean;
};

export type ParagraphData = {
  text?: string;
};

type ParagraphParams = {
  data: ParagraphData;
  config: ParagraphConfig;
  api: API;
  readOnly: boolean;
};

type ParagraphCSS = {
  wrapper: string;
};

export default class Paragraph {
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  api: API;

  readOnly: boolean;

  private _CSS: ParagraphCSS;

  private _placeholder: string;

  private _data: ParagraphData;

  private _element: HTMLDivElement | null;

  private _preserveBlank: boolean;

  constructor({ data, config, api, readOnly }: ParagraphParams) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      wrapper: 'e-paragraph',
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }

    this._placeholder = config.placeholder
      ? config.placeholder
      : Paragraph.DEFAULT_PLACEHOLDER;
    this._data = data ?? {};
    this._element = null;
    this._preserveBlank = config.preserveBlank ?? false;
  }

  onKeyUp(e: KeyboardEvent): void {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    if (!this._element) {
      return;
    }

    const { textContent } = this._element;

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  drawView(): HTMLDivElement {
    const div = document.createElement('p');

    div.classList.add(this._CSS.wrapper);
    div.contentEditable = 'false';
    div.dataset.placeholderActive = this.api.i18n.t(this._placeholder);

    if (this._data.text) {
      div.innerHTML = this._data.text;
    }

    if (!this.readOnly) {
      div.contentEditable = 'true';
      div.addEventListener('keyup', this.onKeyUp);
    }

    return div as HTMLDivElement;
  }

  render(): HTMLDivElement {
    this._element = this.drawView();

    return this._element;
  }

  merge(data: ParagraphData): void {
    if (!this._element) {
      return;
    }

    this._data.text += data.text;

    const fragment = makeFragment(data.text);

    this._element.appendChild(fragment);

    this._element.normalize();
  }

  validate(savedData: ParagraphData): boolean {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false;
    }

    return true;
  }

  save(toolsContent: HTMLDivElement): ParagraphData {
    return {
      text: toolsContent.innerHTML,
    };
  }

  onPaste(event: HTMLPasteEvent): void {
    const data = {
      text: event.detail.data.innerHTML,
    };

    this._data = data;

    window.requestAnimationFrame(() => {
      if (!this._element) {
        return;
      }
      this._element.innerHTML = this._data.text || '';
    });
  }

  static get conversionConfig(): ConversionConfig {
    return {
      export: 'text',
      import: 'text',
    };
  }

  static get sanitize(): SanitizerConfig {
    return {
      text: {
        br: true,
      },
    };
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get pasteConfig(): PasteConfig {
    return {
      tags: ['P'],
    };
  }

  static get toolbox(): ToolboxConfig {
    return {
      icon: IconText,
      title: 'Text',
    };
  }
}

function makeFragment(htmlString: string): DocumentFragment {
  const tempDiv = document.createElement('div');

  tempDiv.innerHTML = htmlString.trim();

  const fragment = document.createDocumentFragment();

  fragment.append(...Array.from(tempDiv.childNodes));

  return fragment;
}
