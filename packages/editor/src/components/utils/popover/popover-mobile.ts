import { PopoverAbstract } from '@/components/utils/popover/popover-abstract';
import ScrollLocker from '@/components/utils/scroll-locker';
import { PopoverHeader } from '@/components/utils/popover/components/popover-header';
import { PopoverStatesHistory } from '@/components/utils/popover/utils/popover-states-history';
import type { PopoverItemDefault } from '@/components/utils/popover/components/popover-item';
import { css } from '@/components/utils/popover/popover.const';
import Dom from '@/components/dom';
import { PopoverItemType } from '@/types/utils/popover/popover-item-type';

import type { PopoverItemParams } from '@/types/utils/popover/popover-item';
import type {
  PopoverMobileNodes,
  PopoverParams,
} from '@/types/utils/popover/popover';

export class PopoverMobile extends PopoverAbstract<PopoverMobileNodes> {
  private scrollLocker = new ScrollLocker();

  private header: PopoverHeader | undefined | null;

  private history = new PopoverStatesHistory();

  private isHidden = true;

  constructor(params: PopoverParams) {
    super(params, {
      [PopoverItemType.Default]: {
        hint: {
          enabled: false,
        },
      },
      [PopoverItemType.Html]: {
        hint: {
          enabled: false,
        },
      },
    });

    this.nodes.overlay = Dom.make('div', [css.overlay, css.overlayHidden]);
    this.nodes.popover.insertBefore(
      this.nodes.overlay,
      this.nodes.popover.firstChild,
    );

    this.listeners.on(this.nodes.overlay, 'click', () => {
      this.hide();
    });

    this.history.push({ items: params.items });
  }

  public show(): void {
    this.nodes.overlay.classList.remove(css.overlayHidden);

    super.show();

    this.scrollLocker.lock();

    this.isHidden = false;
  }

  public hide(): void {
    if (this.isHidden) {
      return;
    }

    super.hide();
    this.nodes.overlay.classList.add(css.overlayHidden);

    this.scrollLocker.unlock();

    this.history.reset();

    this.isHidden = true;
  }

  public destroy(): void {
    super.destroy();

    this.scrollLocker.unlock();
  }

  protected override showNestedItems(item: PopoverItemDefault): void {
    this.updateItemsAndHeader(item.children, item.title);

    this.history.push({
      title: item.title,
      items: item.children,
    });
  }

  private updateItemsAndHeader(
    items: PopoverItemParams[],
    title?: string,
  ): void {
    if (this.header !== null && this.header !== undefined) {
      this.header.destroy();
      this.header = null;
    }
    if (title !== undefined) {
      this.header = new PopoverHeader({
        text: title,
        onBackButtonClick: () => {
          this.history.pop();

          this.updateItemsAndHeader(
            this.history.currentItems,
            this.history.currentTitle,
          );
        },
      });
      const headerEl = this.header.getElement();

      if (headerEl !== null) {
        this.nodes.popoverContainer.insertBefore(
          headerEl,
          this.nodes.popoverContainer.firstChild,
        );
      }
    }

    this.items.forEach((item) => item.getElement()?.remove());

    this.items = this.buildItems(items);

    this.items.forEach((item) => {
      const itemEl = item.getElement();

      if (itemEl === null) {
        return;
      }
      this.nodes.items?.appendChild(itemEl);
    });
  }
}
