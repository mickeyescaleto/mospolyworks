import Dom from '@/components/dom';
import { css } from '@/components/utils/popover/components/hint/hint.const';
import './hint.css';

import type { HintParams } from '@/types/utils/popover/hint';

export class Hint {
  private nodes: {
    root: HTMLElement;
    title: HTMLElement;
    description?: HTMLElement;
  };

  constructor(params: HintParams) {
    this.nodes = {
      root: Dom.make('div', [
        css.root,
        params.alignment === 'center' ? css.alignedCenter : css.alignedStart,
      ]),
      title: Dom.make('div', css.title, { textContent: params.title }),
    };

    this.nodes.root.appendChild(this.nodes.title);

    if (params.description !== undefined) {
      this.nodes.description = Dom.make('div', css.description, {
        textContent: params.description,
      });

      this.nodes.root.appendChild(this.nodes.description);
    }
  }

  public getElement(): HTMLElement {
    return this.nodes.root;
  }
}
