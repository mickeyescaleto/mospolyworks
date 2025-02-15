import Dom from '@/components/dom';
import { PopoverItem } from '@/components/utils/popover/components/popover-item';
import { css } from '@/components/utils/popover/components/popover-item/popover-item-separator/popover-item-separator.const';

export class PopoverItemSeparator extends PopoverItem {
  private nodes: { root: HTMLElement; line: HTMLElement };

  constructor() {
    super();

    this.nodes = {
      root: Dom.make('div', css.container),
      line: Dom.make('div', css.line),
    };

    this.nodes.root.appendChild(this.nodes.line);
  }

  public getElement(): HTMLElement {
    return this.nodes.root;
  }

  public toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(css.hidden, isHidden);
  }
}
