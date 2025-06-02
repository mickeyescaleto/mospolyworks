import { IconDelimiter } from '@codexteam/icons';

import './styles.css';
import {
  BlockTool,
  BlockToolConstructorOptions,
} from '@repo/editor/types/tools/block-tool';
import { BlockToolData } from '@repo/editor/types/tools/block-tool-data';
import { ToolboxConfig } from '@repo/editor/types/tools/tool-settings';
import { PasteConfig } from '@repo/editor/types/configs/paste-config';
import { PasteEvent } from '@repo/editor/types/tools/paste-events';
import { API } from '@repo/editor/types';

export default class Delimiter implements BlockTool {
  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get contentless(): boolean {
    return true;
  }

  private api: API;

  private _CSS: {
    block: string;
    wrapper: string;
  };

  private data: BlockToolData;

  private _element: HTMLDivElement;

  constructor({ data, config, api }: BlockToolConstructorOptions) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'e-delimiter',
    };

    this._element = this.drawView();

    this.data = data;
  }

  drawView(): HTMLDivElement {
    let div = document.createElement('div');

    div.classList.add(this._CSS.wrapper, this._CSS.block);

    return div;
  }

  render(): HTMLDivElement {
    return this._element;
  }

  save(toolsContent: HTMLElement): BlockToolData {
    return {};
  }

  static get toolbox(): ToolboxConfig {
    return {
      icon: IconDelimiter,
      title: 'Delimiter',
    };
  }

  static get pasteConfig(): PasteConfig {
    return { tags: ['HR'] };
  }

  onPaste(event: PasteEvent): void {
    this.data = {};
  }
}
