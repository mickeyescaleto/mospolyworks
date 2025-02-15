import Flipper from '@/components/flipper';
import { PopoverAbstract } from '@/components/utils/popover/popover-abstract';
import type { PopoverItem } from '@/components/utils/popover/components/popover-item';
import {
  PopoverItemSeparator,
  css as popoverItemCls,
} from '@/components/utils/popover/components/popover-item';
import { keyCodes } from '@/components/utilities';
import { CSSVariables, css } from '@/components/utils/popover/popover.const';
import type { SearchableItem } from '@/components/utils/popover/components/search-input';
import {
  SearchInput,
  SearchInputEvent,
} from '@/components/utils/popover/components/search-input';
import { cacheable } from '@/components/utilities';
import { PopoverItemDefault } from '@/components/utils/popover/components/popover-item';
import { PopoverItemHtml } from '@/components/utils/popover/components/popover-item/popover-item-html/popover-item-html';
import { PopoverEvent } from '@/types/utils/popover/popover-event';

import type { PopoverItemRenderParamsMap } from '@/types/utils/popover/popover-item';
import type { PopoverParams } from '@/types/utils/popover/popover';

export class PopoverDesktop extends PopoverAbstract {
  public flipper: Flipper | undefined;

  public nestingLevel = 0;

  protected nestedPopover: PopoverDesktop | undefined | null;

  protected nestedPopoverTriggerItem: PopoverItem | null = null;

  private previouslyHoveredItem: PopoverItem | null = null;

  private scopeElement: HTMLElement = document.body;

  constructor(
    params: PopoverParams,
    itemsRenderParams?: PopoverItemRenderParamsMap,
  ) {
    super(params, itemsRenderParams);

    if (params.nestingLevel !== undefined) {
      this.nestingLevel = params.nestingLevel;
    }

    if (this.nestingLevel > 0) {
      this.nodes.popover.classList.add(css.popoverNested);
    }

    if (params.scopeElement !== undefined) {
      this.scopeElement = params.scopeElement;
    }

    if (this.nodes.popoverContainer !== null) {
      this.listeners.on(
        this.nodes.popoverContainer,
        'mouseover',
        (event: Event) => this.handleHover(event),
      );
    }

    if (params.searchable) {
      this.addSearch();
    }

    if (params.flippable !== false) {
      this.flipper = new Flipper({
        items: this.flippableElements,
        focusedItemClass: popoverItemCls.focused,
        allowedKeys: [keyCodes.TAB, keyCodes.UP, keyCodes.DOWN, keyCodes.ENTER],
      });

      this.flipper.onFlip(this.onFlip);
    }
  }

  public hasFocus(): boolean {
    if (this.flipper === undefined) {
      return false;
    }

    return this.flipper.hasFocus();
  }

  public get scrollTop(): number {
    if (this.nodes.items === null) {
      return 0;
    }

    return this.nodes.items.scrollTop;
  }

  public get offsetTop(): number {
    if (this.nodes.popoverContainer === null) {
      return 0;
    }

    return this.nodes.popoverContainer.offsetTop;
  }

  public show(): void {
    this.nodes.popover.style.setProperty(
      CSSVariables.PopoverHeight,
      this.size.height + 'px',
    );

    if (!this.shouldOpenBottom) {
      this.nodes.popover.classList.add(css.popoverOpenTop);
    }

    if (!this.shouldOpenRight) {
      this.nodes.popover.classList.add(css.popoverOpenLeft);
    }

    super.show();
    this.flipper?.activate(this.flippableElements);
  }

  public hide = (): void => {
    super.hide();

    this.destroyNestedPopoverIfExists();

    this.flipper?.deactivate();

    this.previouslyHoveredItem = null;
  };

  public destroy(): void {
    this.hide();
    super.destroy();
  }

  protected override showNestedItems(item: PopoverItem): void {
    if (this.nestedPopover !== null && this.nestedPopover !== undefined) {
      return;
    }

    this.nestedPopoverTriggerItem = item;

    this.showNestedPopoverForItem(item);
  }

  protected handleHover(event: Event): void {
    const item = this.getTargetItem(event);

    if (item === undefined) {
      return;
    }

    if (this.previouslyHoveredItem === item) {
      return;
    }

    this.destroyNestedPopoverIfExists();

    this.previouslyHoveredItem = item;

    if (!item.hasChildren) {
      return;
    }

    this.showNestedPopoverForItem(item);
  }

  protected setTriggerItemPosition(
    nestedPopoverEl: HTMLElement,
    item: PopoverItem,
  ): void {
    const itemEl = item.getElement();
    const itemOffsetTop = (itemEl ? itemEl.offsetTop : 0) - this.scrollTop;
    const topOffset = this.offsetTop + itemOffsetTop;

    nestedPopoverEl.style.setProperty(
      CSSVariables.TriggerItemTop,
      topOffset + 'px',
    );
  }

  protected destroyNestedPopoverIfExists(): void {
    if (this.nestedPopover === undefined || this.nestedPopover === null) {
      return;
    }

    this.nestedPopover.off(PopoverEvent.ClosedOnActivate, this.hide);
    this.nestedPopover.hide();
    this.nestedPopover.destroy();
    this.nestedPopover.getElement().remove();
    this.nestedPopover = null;
    this.flipper?.activate(this.flippableElements);

    this.nestedPopoverTriggerItem?.onChildrenClose();
  }

  protected showNestedPopoverForItem(item: PopoverItem): PopoverDesktop {
    this.nestedPopover = new PopoverDesktop({
      searchable: item.isChildrenSearchable,
      items: item.children,
      nestingLevel: this.nestingLevel + 1,
      flippable: item.isChildrenFlippable,
      messages: this.messages,
    });

    item.onChildrenOpen();

    this.nestedPopover.on(PopoverEvent.ClosedOnActivate, this.hide);

    const nestedPopoverEl = this.nestedPopover.getElement();

    this.nodes.popover.appendChild(nestedPopoverEl);

    this.setTriggerItemPosition(nestedPopoverEl, item);

    nestedPopoverEl.style.setProperty(
      CSSVariables.NestingLevel,
      this.nestedPopover.nestingLevel.toString(),
    );

    this.nestedPopover.show();
    this.flipper?.deactivate();

    return this.nestedPopover;
  }

  private get shouldOpenBottom(): boolean {
    if (this.nodes.popover === undefined || this.nodes.popover === null) {
      return false;
    }
    const popoverRect = this.nodes.popoverContainer.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverHeight = this.size.height;
    const popoverPotentialBottomEdge = popoverRect.top + popoverHeight;
    const popoverPotentialTopEdge = popoverRect.top - popoverHeight;
    const bottomEdgeForComparison = Math.min(
      window.innerHeight,
      scopeElementRect.bottom,
    );

    return (
      popoverPotentialTopEdge < scopeElementRect.top ||
      popoverPotentialBottomEdge <= bottomEdgeForComparison
    );
  }

  private get shouldOpenRight(): boolean {
    if (this.nodes.popover === undefined || this.nodes.popover === null) {
      return false;
    }

    const popoverRect = this.nodes.popover.getBoundingClientRect();
    const scopeElementRect = this.scopeElement.getBoundingClientRect();
    const popoverWidth = this.size.width;
    const popoverPotentialRightEdge = popoverRect.right + popoverWidth;
    const popoverPotentialLeftEdge = popoverRect.left - popoverWidth;
    const rightEdgeForComparison = Math.min(
      window.innerWidth,
      scopeElementRect.right,
    );

    return (
      popoverPotentialLeftEdge < scopeElementRect.left ||
      popoverPotentialRightEdge <= rightEdgeForComparison
    );
  }

  @cacheable
  public get size(): { height: number; width: number } {
    const size = {
      height: 0,
      width: 0,
    };

    if (this.nodes.popover === null) {
      return size;
    }

    const popoverClone = this.nodes.popover.cloneNode(true) as HTMLElement;

    popoverClone.style.visibility = 'hidden';
    popoverClone.style.position = 'absolute';
    popoverClone.style.top = '-1000px';

    popoverClone.classList.add(css.popoverOpened);
    popoverClone.querySelector('.' + css.popoverNested)?.remove();
    document.body.appendChild(popoverClone);

    const container = popoverClone.querySelector(
      '.' + css.popoverContainer,
    ) as HTMLElement;

    size.height = container.offsetHeight;
    size.width = container.offsetWidth;
    popoverClone.remove();

    return size;
  }

  private get flippableElements(): HTMLElement[] {
    const result = this.items
      .map((item) => {
        if (item instanceof PopoverItemDefault) {
          return item.getElement();
        }
        if (item instanceof PopoverItemHtml) {
          return item.getControls();
        }
      })
      .flat()
      .filter((item) => item !== undefined && item !== null);

    return result as HTMLElement[];
  }

  private onFlip = (): void => {
    const focusedItem = this.itemsDefault.find((item) => item.isFocused);

    focusedItem?.onFocus();
  };

  private addSearch(): void {
    this.search = new SearchInput({
      items: this.itemsDefault,
      placeholder: this.messages.search,
    });

    this.search.on(SearchInputEvent.Search, this.onSearch);

    const searchElement = this.search.getElement();

    searchElement.classList.add(css.search);

    this.nodes.popoverContainer.insertBefore(
      searchElement,
      this.nodes.popoverContainer.firstChild,
    );
  }

  private onSearch = (data: {
    query: string;
    items: SearchableItem[];
  }): void => {
    const isEmptyQuery = data.query === '';
    const isNothingFound = data.items.length === 0;

    this.items.forEach((item) => {
      let isHidden = false;

      if (item instanceof PopoverItemDefault) {
        isHidden = !data.items.includes(item);
      } else if (
        item instanceof PopoverItemSeparator ||
        item instanceof PopoverItemHtml
      ) {
        isHidden = isNothingFound || !isEmptyQuery;
      }
      item.toggleHidden(isHidden);
    });
    this.toggleNothingFoundMessage(isNothingFound);

    const flippableElements =
      data.query === ''
        ? this.flippableElements
        : data.items.map((item) => (item as PopoverItem).getElement());

    if (this.flipper?.isActivated) {
      this.flipper.deactivate();
      this.flipper.activate(flippableElements as HTMLElement[]);
    }
  };

  private toggleNothingFoundMessage(isDisplayed: boolean): void {
    this.nodes.nothingFoundMessage.classList.toggle(
      css.nothingFoundMessageDisplayed,
      isDisplayed,
    );
  }
}
