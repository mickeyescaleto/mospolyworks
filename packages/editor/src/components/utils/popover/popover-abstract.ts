import type { PopoverItem } from '@/components/utils/popover/components/popover-item';
import {
  PopoverItemDefault,
  PopoverItemSeparator,
} from '@/components/utils/popover/components/popover-item';
import Dom from '@/components/dom';
import type { SearchInput } from '@/components/utils/popover/components/search-input';
import EventsDispatcher from '@/components/utils/events';
import Listeners from '@/components/utils/listeners';
import { css } from '@/components/utils/popover/popover.const';
import { PopoverItemHtml } from '@/components/utils/popover/components/popover-item/popover-item-html/popover-item-html';
import { PopoverEvent } from '@/types/utils/popover/popover-event';
import { PopoverItemType } from '@/types/utils/popover/popover-item-type';

import type {
  PopoverEventMap,
  PopoverMessages,
  PopoverParams,
  PopoverNodes,
} from '@/types/utils/popover/popover';
import type { PopoverItemRenderParamsMap } from '@/types/utils/popover/popover-item';
import type { PopoverItemParams } from '@/types/utils/popover/popover-item';

export abstract class PopoverAbstract<
  Nodes extends PopoverNodes = PopoverNodes,
> extends EventsDispatcher<PopoverEventMap> {
  protected items: Array<PopoverItem>;

  protected listeners: Listeners = new Listeners();

  protected nodes: Nodes;

  protected get itemsDefault(): PopoverItemDefault[] {
    return this.items.filter(
      (item) => item instanceof PopoverItemDefault,
    ) as PopoverItemDefault[];
  }

  protected search: SearchInput | undefined;

  protected messages: PopoverMessages = {
    nothingFound: 'Nothing found',
    search: 'Search',
  };

  constructor(
    protected readonly params: PopoverParams,
    protected readonly itemsRenderParams: PopoverItemRenderParamsMap = {},
  ) {
    super();

    this.items = this.buildItems(params.items);

    if (params.messages) {
      this.messages = {
        ...this.messages,
        ...params.messages,
      };
    }

    this.nodes = {} as Nodes;

    this.nodes.popoverContainer = Dom.make('div', [css.popoverContainer]);

    this.nodes.nothingFoundMessage = Dom.make(
      'div',
      [css.nothingFoundMessage],
      {
        textContent: this.messages.nothingFound,
      },
    );

    this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage);
    this.nodes.items = Dom.make('div', [css.items]);

    this.items.forEach((item) => {
      const itemEl = item.getElement();

      if (itemEl === null) {
        return;
      }

      this.nodes.items.appendChild(itemEl);
    });

    this.nodes.popoverContainer.appendChild(this.nodes.items);

    this.listeners.on(this.nodes.popoverContainer, 'click', (event: Event) =>
      this.handleClick(event),
    );

    this.nodes.popover = Dom.make('div', [css.popover, this.params.class]);

    this.nodes.popover.appendChild(this.nodes.popoverContainer);
  }

  public getElement(): HTMLElement {
    return this.nodes.popover as HTMLElement;
  }

  public show(): void {
    this.nodes.popover.classList.add(css.popoverOpened);

    if (this.search !== undefined) {
      this.search.focus();
    }
  }

  public hide(): void {
    this.nodes.popover.classList.remove(css.popoverOpened);
    this.nodes.popover.classList.remove(css.popoverOpenTop);

    this.itemsDefault.forEach((item) => item.reset());

    if (this.search !== undefined) {
      this.search.clear();
    }

    this.emit(PopoverEvent.Closed);
  }

  public destroy(): void {
    this.items.forEach((item) => item.destroy());
    this.nodes.popover.remove();
    this.listeners.removeAll();
    this.search?.destroy();
  }

  public activateItemByName(name: string): void {
    const foundItem = this.items.find((item) => item.name === name);

    this.handleItemClick(foundItem);
  }

  protected buildItems(items: PopoverItemParams[]): Array<PopoverItem> {
    return items.map((item) => {
      switch (item.type) {
        case PopoverItemType.Separator:
          return new PopoverItemSeparator();
        case PopoverItemType.Html:
          return new PopoverItemHtml(
            item,
            this.itemsRenderParams[PopoverItemType.Html],
          );
        default:
          return new PopoverItemDefault(
            item,
            this.itemsRenderParams[PopoverItemType.Default],
          );
      }
    });
  }

  protected getTargetItem(
    event: Event,
  ): PopoverItemDefault | PopoverItemHtml | undefined {
    return this.items
      .filter(
        (item) =>
          item instanceof PopoverItemDefault || item instanceof PopoverItemHtml,
      )
      .find((item) => {
        const itemEl = item.getElement();

        if (itemEl === null) {
          return false;
        }

        return event.composedPath().includes(itemEl);
      }) as PopoverItemDefault | PopoverItemHtml | undefined;
  }

  protected handleItemClick(item: PopoverItem): void {
    if ('isDisabled' in item && item.isDisabled) {
      return;
    }

    if (item.hasChildren) {
      this.showNestedItems(item as PopoverItemDefault | PopoverItemHtml);

      if ('handleClick' in item && typeof item.handleClick === 'function') {
        item.handleClick();
      }

      return;
    }

    this.itemsDefault.filter((x) => x !== item).forEach((x) => x.reset());

    if ('handleClick' in item && typeof item.handleClick === 'function') {
      item.handleClick();
    }

    this.toggleItemActivenessIfNeeded(item);

    if (item.closeOnActivate) {
      this.hide();

      this.emit(PopoverEvent.ClosedOnActivate);
    }
  }

  private handleClick(event: Event): void {
    const item = this.getTargetItem(event);

    if (item === undefined) {
      return;
    }

    this.handleItemClick(item);
  }

  private toggleItemActivenessIfNeeded(clickedItem: PopoverItem): void {
    if (!(clickedItem instanceof PopoverItemDefault)) {
      return;
    }

    if (clickedItem.toggle === true) {
      clickedItem.toggleActive();
    }

    if (typeof clickedItem.toggle === 'string') {
      const itemsInToggleGroup = this.itemsDefault.filter(
        (item) => item.toggle === clickedItem.toggle,
      );

      if (itemsInToggleGroup.length === 1) {
        clickedItem.toggleActive();

        return;
      }

      itemsInToggleGroup.forEach((item) => {
        item.toggleActive(item === clickedItem);
      });
    }
  }

  protected abstract showNestedItems(
    item: PopoverItemDefault | PopoverItemHtml,
  ): void;
}
