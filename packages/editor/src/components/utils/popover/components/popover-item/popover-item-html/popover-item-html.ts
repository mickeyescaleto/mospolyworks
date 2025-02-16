import { PopoverItem } from '@repo/editor/components/utils/popover/components/popover-item/popover-item';
import { css } from '@repo/editor/components/utils/popover/components/popover-item/popover-item-html/popover-item-html.const';
import Dom from '@repo/editor/components/dom';
import { PopoverItemType } from '@repo/editor/types/utils/popover/popover-item-type';

import type {
  PopoverItemHtmlParams,
  PopoverItemRenderParamsMap,
} from '@repo/editor/types/utils/popover/popover-item';

export class PopoverItemHtml extends PopoverItem {
  private nodes: { root: HTMLElement };

  constructor(
    params: PopoverItemHtmlParams,
    renderParams?: PopoverItemRenderParamsMap[PopoverItemType.Html],
  ) {
    super(params);

    this.nodes = {
      root: Dom.make('div', css.root),
    };

    this.nodes.root.appendChild(params.element);

    if (params.name) {
      this.nodes.root.dataset.itemName = params.name;
    }

    if (params.hint !== undefined && renderParams?.hint?.enabled !== false) {
      this.addHint(this.nodes.root, {
        ...params.hint,
        position: renderParams?.hint?.position || 'right',
      });
    }
  }

  public getElement(): HTMLElement {
    return this.nodes.root;
  }

  public toggleHidden(isHidden: boolean): void {
    this.nodes.root?.classList.toggle(css.hidden, isHidden);
  }

  public getControls(): HTMLElement[] {
    const controls = this.nodes.root.querySelectorAll<HTMLElement>(
      `button, ${Dom.allInputsSelector}`,
    );

    return Array.from(controls);
  }
}
