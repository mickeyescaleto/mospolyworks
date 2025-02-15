import { IconChevronLeft } from '@codexteam/icons';
import Dom from '@/components/dom';
import { css } from '@/components/utils/popover/components/popover-header/popover-header.const';
import Listeners from '@/components/utils/listeners';

import type { PopoverHeaderParams } from '@/components/utils/popover/components/popover-header/popover-header.types';

export class PopoverHeader {
  private listeners = new Listeners();

  private nodes: {
    root: HTMLElement;
    text: HTMLElement;
    backButton: HTMLElement;
  };

  private readonly text: string;

  private readonly onBackButtonClick: () => void;

  constructor({ text, onBackButtonClick }: PopoverHeaderParams) {
    this.text = text;
    this.onBackButtonClick = onBackButtonClick;

    this.nodes = {
      root: Dom.make('div', [css.root]),
      backButton: Dom.make('button', [css.backButton]),
      text: Dom.make('div', [css.text]),
    };
    this.nodes.backButton.innerHTML = IconChevronLeft;
    this.nodes.root.appendChild(this.nodes.backButton);
    this.listeners.on(this.nodes.backButton, 'click', this.onBackButtonClick);

    this.nodes.text.innerText = this.text;
    this.nodes.root.appendChild(this.nodes.text);
  }

  public getElement(): HTMLElement | null {
    return this.nodes.root;
  }

  public destroy(): void {
    this.nodes.root.remove();
    this.listeners.destroy();
  }
}
